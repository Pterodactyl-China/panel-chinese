import type { Actions } from 'easy-peasy';
import { useStoreActions } from 'easy-peasy';
import type { FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import type { UpdateUserValues } from '@/api/admin/users';
import { createUser } from '@/api/admin/users';
import AdminContentBlock from '@/components/admin/AdminContentBlock';
import UserForm from '@/components/admin/users/UserForm';
import FlashMessageRender from '@/components/FlashMessageRender';
import type { ApplicationStore } from '@/state';

export default () => {
    const navigate = useNavigate();

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );

    const submit = (values: UpdateUserValues, { setSubmitting }: FormikHelpers<UpdateUserValues>) => {
        clearFlashes('user:create');

        createUser(values)
            .then(user => navigate(`/admin/users/${user.id}`))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'user:create', error });
            })
            .then(() => setSubmitting(false));
    };

    return (
        <AdminContentBlock title={'新建用户'}>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>新建用户</h2>
                    <p css={tw`text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}>
                        添加新用户到面板。
                    </p>
                </div>
            </div>

            <FlashMessageRender byKey={'user:create'} css={tw`mb-4`} />

            <UserForm title={'创建用户'} onSubmit={submit} role={null} />
        </AdminContentBlock>
    );
};
