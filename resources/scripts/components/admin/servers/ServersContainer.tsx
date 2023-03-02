import { NavLink } from 'react-router-dom';
import tw from 'twin.macro';

import FlashMessageRender from '@/components/FlashMessageRender';
import AdminContentBlock from '@/components/admin/AdminContentBlock';
import ServersTable from '@/components/admin/servers/ServersTable';
import Button from '@/components/elements/Button';

function ServersContainer() {
    return (
        <AdminContentBlock title={'服务器'}>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>服务器</h2>
                    <p css={tw`text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}>
                        系统上所有可用的服务器。
                    </p>
                </div>

                <div css={tw`flex ml-auto pl-4`}>
                    <NavLink to={`/admin/servers/new`}>
                        <Button type={'button'} size={'large'} css={tw`h-10 px-4 py-0 whitespace-nowrap`}>
                            创建服务器
                        </Button>
                    </NavLink>
                </div>
            </div>

            <FlashMessageRender byKey={'servers'} css={tw`mb-4`} />

            <ServersTable />
        </AdminContentBlock>
    );
}

export default ServersContainer;
