import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import type { ReactNode } from 'react';
import { Component } from 'react';
import tw from 'twin.macro';

import Icon from '@/components/elements/Icon';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    override state: State = {
        hasError: false,
    };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    override componentDidCatch(error: Error) {
        console.error(error);
    }

    override render() {
        return this.state.hasError ? (
            <div css={tw`flex items-center justify-center w-full my-4`}>
                <div css={tw`flex items-center bg-neutral-900 rounded p-3 text-red-500`}>
                    <Icon icon={faExclamationTriangle} css={tw`h-4 w-auto mr-2`} />

                    <p css={tw`text-sm text-neutral-100`}>应用程序在渲染此视图时遇到错误，请尝试刷新此页面.</p>
                </div>
            </div>
        ) : (
            this.props.children
        );
    }
}

export default ErrorBoundary;
