import { useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import tw from 'twin.macro';

import ServerManageContainer from '@/components/admin/servers/ServerManageContainer';
import ServerStartupContainer from '@/components/admin/servers/ServerStartupContainer';
import AdminContentBlock from '@/components/admin/AdminContentBlock';
import Spinner from '@/components/elements/Spinner';
import FlashMessageRender from '@/components/FlashMessageRender';
import { SubNavigation, SubNavigationLink } from '@/components/admin/SubNavigation';
import ServerSettingsContainer from '@/components/admin/servers/ServerSettingsContainer';
import useFlash from '@/plugins/useFlash';
import { useServerFromRoute } from '@/api/admin/server';
import { AdjustmentsIcon, CogIcon, DatabaseIcon, FolderIcon, ShieldExclamationIcon } from '@heroicons/react/outline';

export default () => {
    const params = useParams<'id'>();

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { data: server, error, isValidating, mutate } = useServerFromRoute();

    useEffect(() => {
        mutate();
    }, []);

    useEffect(() => {
        if (!error) clearFlashes('server');
        if (error) clearAndAddHttpError({ key: 'server', error });
    }, [error]);

    if (!server || (error && isValidating)) {
        return (
            <AdminContentBlock showFlashKey={'server'}>
                <Spinner size={'large'} centered />
            </AdminContentBlock>
        );
    }

    return (
        <AdminContentBlock title={'服务器 - ' + server.name}>
            <FlashMessageRender byKey={'backups'} css={tw`mb-4`} />
            <div css={tw`w-full flex flex-row items-center mb-4`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>{server.name}</h2>
                    <p css={tw`text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}>
                        {server.uuid}
                    </p>
                </div>
            </div>

            <FlashMessageRender byKey={'server'} css={tw`mb-4`} />

            <SubNavigation>
                <SubNavigationLink to={`/admin/servers/${params.id}`} name={'设置'} icon={CogIcon} />
                <SubNavigationLink to={`/admin/servers/${params.id}/startup`} name={'启动'} icon={AdjustmentsIcon} />
                <SubNavigationLink to={`/admin/servers/${params.id}/databases`} name={'数据库'} icon={DatabaseIcon} />
                <SubNavigationLink to={`/admin/servers/${params.id}/mounts`} name={'Mounts'} icon={FolderIcon} />
                <SubNavigationLink
                    to={`/admin/servers/${params.id}/manage`}
                    name={'管理'}
                    icon={ShieldExclamationIcon}
                />
            </SubNavigation>

            <Routes>
                <Route path="" element={<ServerSettingsContainer />} />
                <Route path="startup" element={<ServerStartupContainer />} />
                <Route path="manage" element={<ServerManageContainer />} />
            </Routes>
        </AdminContentBlock>
    );
};
