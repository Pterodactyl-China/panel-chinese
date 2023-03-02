import { BanIcon, DotsVerticalIcon, LockOpenIcon, PencilIcon, SupportIcon, TrashIcon } from '@heroicons/react/solid';
import { useState } from 'react';

import Checkbox from '@/components/elements/inputs/Checkbox';
import { Dropdown } from '@/components/elements/dropdown';
import { Dialog } from '@/components/elements/dialog';
import type { User } from '@definitions/admin';

interface Props {
    user: User;
    selected?: boolean;
    onRowChange: (user: User, selected: boolean) => void;
}

function UserTableRow({ user, selected, onRowChange }: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Dialog.Confirm
                title={'删除帐户'}
                open={visible}
                onClose={() => setVisible(false)}
                onConfirmed={() => {
                    console.log('yeet');
                }}
            >
                该帐号将被永久删除。
            </Dialog.Confirm>

            <tr>
                <td className={'whitespace-nowrap'}>
                    <div className={'flex w-8 items-center justify-end'}>
                        <Checkbox checked={selected} onChange={e => onRowChange(user, e.currentTarget.checked)} />
                    </div>
                </td>
                <td className={'whitespace-nowrap py-4 pl-6'}>
                    <div className={'flex items-center'}>
                        <div className={'h-10 w-10'}>
                            <img src={user.avatarUrl} className={'h-10 w-10 rounded-full'} alt={'用户头像'} />
                        </div>
                        <div className={'ml-4'}>
                            <p className={'font-medium'}>{user.email}</p>
                            <p className={'text-sm text-neutral-400'}>{user.uuid}</p>
                        </div>
                    </div>
                </td>
                <td className={'whitespace-nowrap py-4 pl-2'}>
                    {user.isUsingTwoFactor && (
                        <span
                            className={
                                'rounded bg-green-100 px-2 py-0.5 text-xs font-semibold uppercase text-green-700'
                            }
                        >
                            启用 动态口令认证
                        </span>
                    )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                    <Dropdown>
                        <Dropdown.Button className="px-2">
                            <DotsVerticalIcon />
                        </Dropdown.Button>
                        <Dropdown.Item to={`/admin/users/${user.id}`} icon={<PencilIcon />}>
                            编辑
                        </Dropdown.Item>
                        <Dropdown.Item icon={<SupportIcon />}>重置密码</Dropdown.Item>
                        <Dropdown.Item icon={<LockOpenIcon />} disabled={!user.isUsingTwoFactor}>
                            禁用 动态口令认证
                        </Dropdown.Item>
                        <Dropdown.Item icon={<BanIcon />}>冻结</Dropdown.Item>
                        <Dropdown.Gap />
                        <Dropdown.Item icon={<TrashIcon />} onClick={() => setVisible(true)} danger>
                            删除帐户
                        </Dropdown.Item>
                    </Dropdown>
                </td>
            </tr>
        </>
    );
}

export default UserTableRow;
