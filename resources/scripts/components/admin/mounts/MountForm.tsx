import type { FormikHelpers } from 'formik';
import { Field as FormikField, Form, Formik } from 'formik';
import type { ReactNode } from 'react';
import tw from 'twin.macro';
import { boolean, object, string } from 'yup';

import AdminBox from '@/components/admin/AdminBox';
import { Button } from '@/components/elements/button';
import Field from '@/components/elements/Field';
import Label from '@/components/elements/Label';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';

interface Values {
    name: string;
    description: string;
    source: string;
    target: string;
    readOnly: string;
    userMountable: string;
}

interface Props {
    action: string;
    title: string;
    initialValues?: Values;

    onSubmit: (values: Values, helpers: FormikHelpers<Values>) => void;

    children?: ReactNode;
}

function MountForm({ action, title, initialValues, children, onSubmit }: Props) {
    const submit = (values: Values, helpers: FormikHelpers<Values>) => {
        onSubmit(values, helpers);
    };

    if (!initialValues) {
        initialValues = {
            name: '',
            description: '',
            source: '',
            target: '',
            readOnly: '0',
            userMountable: '0',
        };
    }

    return (
        <Formik
            onSubmit={submit}
            initialValues={initialValues}
            validationSchema={object().shape({
                name: string().required().min(1),
                description: string().max(255, ''),
                source: string().max(255, ''),
                target: string().max(255, ''),
                readOnly: boolean(),
                userMountable: boolean(),
            })}
        >
            {({ isSubmitting, isValid }) => (
                <AdminBox title={title} css={tw`relative`}>
                    <SpinnerOverlay visible={isSubmitting} />

                    <Form css={tw`mb-0`}>
                        <div>
                            <Field id={'name'} name={'name'} label={'名称'} type={'text'} />
                        </div>

                        <div css={tw`mt-6`}>
                            <Field id={'description'} name={'description'} label={'描述'} type={'text'} />
                        </div>

                        <div css={tw`md:w-full md:flex md:flex-row mt-6`}>
                            <div css={tw`md:w-full md:flex md:flex-col md:mr-4 mt-6 md:mt-0`}>
                                <Field id={'source'} name={'source'} label={'来源路径'} type={'text'} />
                            </div>

                            <div css={tw`md:w-full md:flex md:flex-col md:ml-4 mt-6 md:mt-0`}>
                                <Field id={'target'} name={'target'} label={'目标路径'} type={'text'} />
                            </div>
                        </div>

                        <div css={tw`md:w-full md:flex md:flex-row mt-6`}>
                            <div css={tw`md:w-full md:flex md:flex-col md:mr-4 mt-6 md:mt-0`}>
                                <Label htmlFor={'readOnly'}>权限</Label>

                                <div>
                                    <label css={tw`inline-flex items-center mr-2`}>
                                        <FormikField name={'readOnly'} type={'radio'} value={'0'} />
                                        <span css={tw`ml-2`}>可写</span>
                                    </label>

                                    <label css={tw`inline-flex items-center ml-2`}>
                                        <FormikField name={'readOnly'} type={'radio'} value={'1'} />
                                        <span css={tw`ml-2`}>只读</span>
                                    </label>
                                </div>
                            </div>

                            <div css={tw`md:w-full md:flex md:flex-col md:ml-4 mt-6 md:mt-0`}>
                                <Label htmlFor={'userMountable'}>用户可安装</Label>

                                <div>
                                    <label css={tw`inline-flex items-center mr-2`}>
                                        <FormikField name={'userMountable'} type={'radio'} value={'0'} />
                                        <span css={tw`ml-2`}>仅限管理员</span>
                                    </label>

                                    <label css={tw`inline-flex items-center ml-2`}>
                                        <FormikField name={'userMountable'} type={'radio'} value={'1'} />
                                        <span css={tw`ml-2`}>用户</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div css={tw`w-full flex flex-row items-center mt-6`}>
                            {children}

                            <div css={tw`flex ml-auto`}>
                                <Button type="submit" disabled={isSubmitting || !isValid}>
                                    {action}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </AdminBox>
            )}
        </Formik>
    );
}

export default MountForm;
