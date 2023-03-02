import { faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext } from 'formik';
import tw from 'twin.macro';

import AdminBox from '@/components/admin/AdminBox';
import Field from '@/components/elements/Field';

export default () => {
    const { isSubmitting } = useFormikContext();

    return (
        <AdminBox icon={faConciergeBell} title={'功能限制'} isLoading={isSubmitting}>
            <div css={tw`grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6`}>
                <Field
                    id={'featureLimits.allocations'}
                    name={'featureLimits.allocations'}
                    label={'分配限制'}
                    type={'number'}
                    description={'允许用户为此服务器创建的分配总数。'}
                />
                <Field
                    id={'featureLimits.backups'}
                    name={'featureLimits.backups'}
                    label={'备份限制'}
                    type={'number'}
                    description={'可以为此服务器创建的备份总数。'}
                />
                <Field
                    id={'featureLimits.databases'}
                    name={'featureLimits.databases'}
                    label={'数据库限制'}
                    type={'number'}
                    description={'允许用户为此服务器创建的数据库总数。'}
                />
            </div>
        </AdminBox>
    );
};
