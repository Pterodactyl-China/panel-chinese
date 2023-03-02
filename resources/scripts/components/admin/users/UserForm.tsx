import type { Action } from 'easy-peasy';
import { action, createContextStore } from 'easy-peasy';
import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';
import tw from 'twin.macro';
import { bool, object, string } from 'yup';

import type { UpdateUserValues } from '@/api/admin/users';
import AdminBox from '@/components/admin/AdminBox';
import RoleSelect from '@/components/admin/users/RoleSelect';
import CopyOnClick from '@/components/elements/CopyOnClick';
import FormikSwitch from '@/components/elements/FormikSwitch';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Button from '@/components/elements/Button';
import Field, { FieldRow } from '@/components/elements/Field';
import type { User, UserRole } from '@definitions/admin';

interface ctx {
    user: User | undefined;
    setUser: Action<ctx, User | undefined>;
}

export const Context = createContextStore<ctx>({
    user: undefined,

    setUser: action((state, payload) => {
        state.user = payload;
    }),
});

export interface Params {
    title: string;
    initialValues?: UpdateUserValues;
    children?: React.ReactNode;

    onSubmit: (values: UpdateUserValues, helpers: FormikHelpers<UpdateUserValues>) => void;

    uuid?: string;
    role: UserRole | null;
}

export default function UserForm({ title, initialValues, children, onSubmit, uuid, role }: Params) {
    const submit = (values: UpdateUserValues, helpers: FormikHelpers<UpdateUserValues>) => {
        onSubmit(values, helpers);
    };

    if (!initialValues) {
        initialValues = {
            externalId: '',
            username: '',
            email: '',
            password: '',
            adminRoleId: null,
            rootAdmin: false,
        };
    }

    return (
        <Formik
            onSubmit={submit}
            initialValues={initialValues}
            validationSchema={object().shape({
                username: string().min(1).max(32),
                email: string(),
                rootAdmin: bool().required(),
            })}
        >
            {({ isSubmitting, isValid }) => (
                <>
                    <AdminBox title={title} css={tw`relative`}>
                        <SpinnerOverlay visible={isSubmitting} />

                        <Form css={tw`mb-0`}>
                            <FieldRow>
                                {uuid && (
                                    <div>
                                        <Label>UUID</Label>
                                        <CopyOnClick text={uuid}>
                                            <Input type={'text'} value={uuid} readOnly />
                                        </CopyOnClick>
                                    </div>
                                )}
                                <Field
                                    id={'externalId'}
                                    name={'externalId'}
                                    label={'外部 ID'}
                                    type={'text'}
                                    description={'由外部集成使用，不应修改此字段，除非您知道自己在做什么。'}
                                />
                                <Field
                                    id={'username'}
                                    name={'username'}
                                    label={'用户名'}
                                    type={'text'}
                                    description={"除了用户的用户名还有什么可以放在这里呢？"}
                                />
                                <Field
                                    id={'email'}
                                    name={'email'}
                                    label={'邮箱地址'}
                                    type={'email'}
                                    description={"除了用户的电子邮件地址还有什么可以放在这里呢？"}
                                />
                                <Field
                                    id={'password'}
                                    name={'password'}
                                    label={'密码'}
                                    type={'password'}
                                    placeholder={'••••••••'}
                                    autoComplete={'new-password'}
                                    /* TODO: Change description depending on if user is being created or updated. */
                                    description={'留空以通过电子邮件向用户发送一个链接，要求他们在该链接中设置密码。'}
                                />
                                <RoleSelect selected={role} />
                            </FieldRow>

                            {/* TODO: Remove toggle once role permissions are implemented. */}
                            <div css={tw`w-full flex flex-row mb-6`}>
                                <div css={tw`w-full bg-neutral-800 border border-neutral-900 shadow-inner p-4 rounded`}>
                                    <FormikSwitch
                                        name={'rootAdmin'}
                                        label={'Root 管理员'}
                                        description={'这个用户应该是 root 管理员吗？'}
                                    />
                                </div>
                            </div>

                            <div css={tw`w-full flex flex-row items-center mt-6`}>
                                {children}
                                <div css={tw`flex ml-auto`}>
                                    <Button type={'submit'} disabled={isSubmitting || !isValid}>
                                        保存更改
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </AdminBox>
                </>
            )}
        </Formik>
    );
}
