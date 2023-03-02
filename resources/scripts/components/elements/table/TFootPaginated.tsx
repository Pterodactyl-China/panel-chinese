import { PaginationDataSet } from '@/api/http';

const TFootPaginated = ({ pagination, span }: { span: number; pagination: PaginationDataSet }) => {
    const start = (pagination.currentPage - 1) * pagination.perPage;
    const end = (pagination.currentPage - 1) * pagination.perPage + pagination.count;

    return (
        <tfoot>
            <tr className={'bg-neutral-800'}>
                <td scope={'col'} colSpan={span} className={'px-4 py-2'}>
                    <p className={'text-sm text-neutral-500'}>
                        显示第{' '}
                        <span className={'font-semibold text-neutral-400'}>
                            {Math.max(start, Math.min(pagination.total, 1))}
                        </span>{' '}
                        到&nbsp;
                        <span className={'font-semibold text-neutral-400'}>{end}</span> 个结果，共&nbsp;
                        <span className={'font-semibold text-neutral-400'}>{pagination.total}</span> 个结果。
                    </p>
                </td>
            </tr>
        </tfoot>
    );
};

export default TFootPaginated;
