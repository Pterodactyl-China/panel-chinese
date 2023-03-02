import { faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext } from 'formik';
import tw from 'twin.macro';

import AdminBox from '@/components/admin/AdminBox';
import Field from '@/components/elements/Field';
import FormikSwitch from '@/components/elements/FormikSwitch';

export default () => {
    const { isSubmitting } = useFormikContext();

    return (
        <AdminBox icon={faBalanceScale} title={'资源'} isLoading={isSubmitting}>
            <div css={tw`grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6`}>
                <Field
                    id={'limits.cpu'}
                    name={'limits.cpu'}
                    label={'CPU 限制'}
                    type={'text'}
                    description={
                        '系统上的每个线程都被认为是 100%。将此值设置为 0 将允许服务器不受限制地使用 CPU 线程。'
                    }
                />
                <Field
                    id={'limits.threads'}
                    name={'limits.threads'}
                    label={'CPU 核心'}
                    type={'text'}
                    description={
                        '高级: 输入此进程可以运行的特定 CPU 线程，或留空以允许所有线程。这可以是单个数字，也可以是逗号分隔的列表. 例如: 0, 0-1,3, 或 0,1,3,4。建议将该值留空，让 CPU 处理负载均衡。'
                    }
                />
                <Field
                    id={'limits.memory'}
                    name={'limits.memory'}
                    label={'内存限制'}
                    type={'number'}
                    description={'此容器允许的最大内存量。将此设置为 0 将允许此服务器无限制使用内存。'}
                />
                <Field id={'limits.swap'} name={'limits.swap'} label={'虚拟内存限制'} type={'number'} />
                <Field
                    id={'limits.disk'}
                    name={'limits.disk'}
                    label={'存储限制'}
                    type={'number'}
                    description={
                        '如果此服务器使用的空间超过此数量，则将不允许它启动。如果服务器在运行时超过此限制，它将安全停止并锁定，直到有足够的可用空间。调成 0 将允许此服务器使用无限存储空间。'
                    }
                />
                <Field
                    id={'limits.io'}
                    name={'limits.io'}
                    label={'IO 优先级'}
                    type={'number'}
                    description={'高级: 此服务器相对于其他 运行中 服务器的 IO 性能。此值应介于 10 至 1000。'}
                />
                <div css={tw`xl:col-span-2 bg-neutral-800 border border-neutral-900 shadow-inner p-4 rounded`}>
                    <FormikSwitch
                        name={'limits.oomKiller'}
                        label={'内存溢出杀手'}
                        description={'启用 内存溢出杀手 可能会导致服务器进程意外退出。'}
                    />
                </div>
            </div>
        </AdminBox>
    );
};
