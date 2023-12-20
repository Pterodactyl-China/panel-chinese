import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import type { FormikHelpers } from 'formik';
import { Form, Formik, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';
import { object } from 'yup';

import type { Egg } from '@/api/admin/egg';
import type { CreateServerRequest } from '@/api/admin/servers/createServer';
import createServer from '@/api/admin/servers/createServer';
import type { Allocation, Node } from '@/api/admin/node';
import { getAllocations } from '@/api/admin/node';
import AdminBox from '@/components/admin/AdminBox';
import NodeSelect from '@/components/admin/servers/NodeSelect';
import {
    ServerImageContainer,
    ServerServiceContainer,
    ServerVariableContainer,
} from '@/components/admin/servers/ServerStartupContainer';
import BaseSettingsBox from '@/components/admin/servers/settings/BaseSettingsBox';
import FeatureLimitsBox from '@/components/admin/servers/settings/FeatureLimitsBox';
import ServerResourceBox from '@/components/admin/servers/settings/ServerResourceBox';
import Button from '@/components/elements/Button';
import Field from '@/components/elements/Field';
import FormikSwitch from '@/components/elements/FormikSwitch';
import Label from '@/components/elements/Label';
import Select from '@/components/elements/Select';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import AdminContentBlock from '@/components/admin/AdminContentBlock';
import { WithRelationships } from '@/api/admin';

function InternalForm() {
    const {
        isSubmitting,
        isValid,
        setFieldValue,
        values: { environment },
    } = useFormikContext<CreateServerRequest>();

    const [egg, setEgg] = useState<WithRelationships<Egg, 'variables'> | undefined>(undefined);
    const [node, setNode] = useState<Node | undefined>(undefined);
    const [allocations, setAllocations] = useState<Allocation[] | undefined>(undefined);

    useEffect(() => {
        if (egg === undefined) {
            return;
        }

        setFieldValue('eggId', egg.id);
        setFieldValue('startup', '');
        setFieldValue('image', Object.values(egg.dockerImages)[0] ?? '');
    }, [egg]);

    useEffect(() => {
        if (node === undefined) {
            return;
        }

        // server_id: 0 filters out assigned allocations
        getAllocations(node.id, { filters: { server_id: '0' } }).then(setAllocations);
    }, [node]);

    return (
        <Form>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-16">
                <div className="grid grid-cols-1 gap-y-6 col-span-2 md:col-span-1">
                    <BaseSettingsBox>
                        <NodeSelect node={node} setNode={setNode} />
                        <div className="xl:col-span-2 bg-neutral-800 border border-neutral-900 shadow-inner p-4 rounded">
                            <FormikSwitch
                                name={'startOnCompletion'}
                                label={'安装后启动'}
                                description={'服务器应该在安装后自动启动吗？'}
                            />
                        </div>
                    </BaseSettingsBox>
                    <FeatureLimitsBox />
                    <ServerServiceContainer selectedEggId={egg?.id} setEgg={setEgg} nestId={0} />
                </div>
                <div className="grid grid-cols-1 gap-y-6 col-span-2 md:col-span-1">
                    <AdminBox icon={faNetworkWired} title="网络连接" isLoading={isSubmitting}>
                        <div className="grid grid-cols-1 gap-4 lg:gap-6">
                            <div>
                                <Label htmlFor={'allocation.default'}>首选分配</Label>
                                <Select
                                    id={'allocation.default'}
                                    name={'allocation.default'}
                                    disabled={node === undefined}
                                    onChange={e => setFieldValue('allocation.default', Number(e.currentTarget.value))}
                                >
                                    {node === undefined ? (
                                        <option value="">选择一个节点...</option>
                                    ) : (
                                        <option value="">选择一个分配...</option>
                                    )}
                                    {allocations?.map(a => (
                                        <option key={a.id} value={a.id.toString()}>
                                            {a.getDisplayText()}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            {/*<div>*/}
                            {/*    /!* TODO: Multi-select *!/*/}
                            {/*    <Label htmlFor={'allocation.additional'}>额外分配</Label>*/}
                            {/*    <Select id={'allocation.additional'} name={'allocation.additional'} disabled={node === null}>*/}
                            {/*        {node === null ? <option value="">选择一个节点...</option> : <option value="">选择其他分配...</option>}*/}
                            {/*        {allocations?.map(a => <option key={a.id} value={a.id.toString()}>{a.getDisplayText()}</option>)}*/}
                            {/*    </Select>*/}
                            {/*</div>*/}
                        </div>
                    </AdminBox>
                    <ServerResourceBox />
                    <ServerImageContainer />
                </div>

                <AdminBox title={'启动命令'} className="relative w-full col-span-2">
                    <SpinnerOverlay visible={isSubmitting} />

                    <Field
                        id={'startup'}
                        name={'startup'}
                        label={'启动命令'}
                        type={'text'}
                        description={
                            '以下变量可用于启动命令: {{SERVER_MEMORY}}, {{SERVER_IP}}, 和 {{SERVER_PORT}}。它们将分别替换为分配的内存、服务器 IP 和服务器端口的值。'
                        }
                        placeholder={egg?.startup || ''}
                    />
                </AdminBox>

                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    {/* This ensures that no variables are rendered unless the environment has a value for the variable. */}
                    {egg?.relationships.variables
                        ?.filter(v => Object.keys(environment).find(e => e === v.environmentVariable) !== undefined)
                        .map((v, i) => (
                            <ServerVariableContainer key={i} variable={v} />
                        ))}
                </div>

                <div className="bg-neutral-700 rounded shadow-md px-4 py-3 col-span-2">
                    <div className="flex flex-row">
                        <Button type="submit" size="small" className="ml-auto" disabled={isSubmitting || !isValid}>
                            创建服务器
                        </Button>
                    </div>
                </div>
            </div>
        </Form>
    );
}

export default () => {
    const navigate = useNavigate();

    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const submit = (r: CreateServerRequest, { setSubmitting }: FormikHelpers<CreateServerRequest>) => {
        clearFlashes('server:create');

        createServer(r)
            .then(s => navigate(`/admin/servers/${s.id}`))
            .catch(error => clearAndAddHttpError({ key: 'server:create', error }))
            .then(() => setSubmitting(false));
    };

    return (
        <AdminContentBlock title={'创建服务器'}>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>创建服务器</h2>
                    <p css={tw`text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}>
                        将新服务器添加到面板。
                    </p>
                </div>
            </div>

            <FlashMessageRender byKey={'server:create'} css={tw`mb-4`} />

            <Formik
                onSubmit={submit}
                initialValues={
                    {
                        externalId: '',
                        name: '',
                        description: '',
                        ownerId: 0,
                        nodeId: 0,
                        limits: {
                            memory: 1024,
                            swap: 0,
                            disk: 4096,
                            io: 500,
                            cpu: 0,
                            threads: '',
                            oomKiller: true,
                        },
                        featureLimits: {
                            allocations: 1,
                            backups: 0,
                            databases: 0,
                        },
                        allocation: {
                            default: 0,
                            additional: [] as number[],
                        },
                        startup: '',
                        environment: [],
                        eggId: 0,
                        image: '',
                        skipScripts: false,
                        startOnCompletion: true,
                    } as CreateServerRequest
                }
                validationSchema={object().shape({})}
            >
                <InternalForm />
            </Formik>
        </AdminContentBlock>
    );
};
