import { Form, Formik } from 'formik';
import tw from 'twin.macro';

import AdminBox from '@/components/admin/AdminBox';
import Button from '@/components/elements/Button';
import Field, { FieldRow } from '@/components/elements/Field';
import Label from '@/components/elements/Label';
import Select from '@/components/elements/Select';

export default () => {
    const submit = () => {
        //
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                smtpHost: 'smtp.example.com',
                smtpPort: 587,
                smtpEncryption: 'tls',
                username: '',
                password: '',
                mailFrom: 'no-reply@example.com',
                mailFromName: 'Pterodactyl Panel',
            }}
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <AdminBox title="邮件">
                        <FieldRow css={tw`lg:grid-cols-3`}>
                            <Field
                                id={'smtpHost'}
                                name={'smtpHost'}
                                type={'text'}
                                label={'SMTP 主机'}
                                description={''}
                            />
                            <Field
                                id={'smtpPort'}
                                name={'smtpPort'}
                                type={'number'}
                                label={'SMTP 端口'}
                                description={''}
                            />
                            <div>
                                <Label>加密方式</Label>
                                <Select id={'smtpEncryption'} name={'smtpEncryption'} defaultValue={'tls'}>
                                    <option value="">无</option>
                                    <option value="ssl">安全链路层 (SSL)</option>
                                    <option value="tls">传输层安全 (TLS)</option>
                                </Select>
                            </div>
                        </FieldRow>

                        <FieldRow>
                            <Field id={'username'} name={'username'} type={'text'} label={'用户名'} description={''} />
                            <Field
                                id={'password'}
                                name={'password'}
                                type={'password'}
                                label={'密码'}
                                description={''}
                            />
                        </FieldRow>

                        <FieldRow>
                            <Field
                                id={'mailFrom'}
                                name={'mailFrom'}
                                type={'text'}
                                label={'邮件发件人'}
                                description={''}
                            />
                            <Field
                                id={'mailFromName'}
                                name={'mailFromName'}
                                type={'text'}
                                label={'发件人名称'}
                                description={''}
                            />
                        </FieldRow>
                    </AdminBox>

                    <div css={tw`bg-neutral-700 rounded shadow-md px-4 xl:px-5 py-4 mt-6`}>
                        <div css={tw`flex flex-row`}>
                            <Button type="submit" size="small" css={tw`ml-auto`} disabled={isSubmitting || !isValid}>
                                保存更改
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
