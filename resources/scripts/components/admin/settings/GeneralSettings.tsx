import { Form, Formik } from 'formik';
import tw from 'twin.macro';

import AdminBox from '@/components/admin/AdminBox';
import Field, { FieldRow } from '@/components/elements/Field';

export default () => {
    const submit = () => {
        //
    };

    return (
        <Formik onSubmit={submit} initialValues={{}}>
            <Form>
                <div css={tw`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6`}>
                    <AdminBox title="品牌化">
                        <FieldRow>
                            <Field id={'appName'} name={'appName'} type={'text'} label={'应用名称'} description={''} />
                        </FieldRow>
                    </AdminBox>

                    <AdminBox title="数据分析">
                        <FieldRow>
                            <Field
                                id={'googleAnalytics'}
                                name={'googleAnalytics'}
                                type={'text'}
                                label={'Google Analytics'}
                                description={''}
                            />
                        </FieldRow>
                    </AdminBox>
                </div>
            </Form>
        </Formik>
    );
};
