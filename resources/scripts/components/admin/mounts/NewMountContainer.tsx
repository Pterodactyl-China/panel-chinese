import type { Actions } from 'easy-peasy';
import { useStoreActions } from 'easy-peasy';
import type { FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import AdminContentBlock from '@/components/admin/AdminContentBlock';
import FlashMessageRender from '@/components/FlashMessageRender';
import MountForm from '@/components/admin/mounts/MountForm';
import createMount from '@/api/admin/mounts/createMount';
import type { ApplicationStore } from '@/state';

export default () => {
    const navigate = useNavigate();

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );

    const submit = (
        { name, description, source, target, readOnly, userMountable }: any,
        { setSubmitting }: FormikHelpers<any>,
    ) => {
        clearFlashes('mount:create');

        createMount(name, description, source, target, readOnly === '1', userMountable === '1')
            .then(mount => navigate(`/admin/mounts/${mount.id}`))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'mount:create', error });
            })
            .then(() => setSubmitting(false));
    };

    return (
        <AdminContentBlock title={'新建挂载'}>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>新建挂载</h2>
                    <p css={tw`text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}>
                        向面板添加一个新的挂载点。
                    </p>
                </div>
            </div>

            <FlashMessageRender byKey={'mount:create'} css={tw`mb-4`} />

            <MountForm action={'创建'} title={'创建挂载'} onSubmit={submit} />
        </AdminContentBlock>
    );
};
