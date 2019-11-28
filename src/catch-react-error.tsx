import * as React from 'react';
import { Component, ComponentClass, forwardRef, Ref, ReactNode } from 'react';
import IsomorphicErrorBoundary from './components/Errorboundary'
import { ErrorBoundaryProps, ComponentProps } from './interface/propsInterface'

const catchreacterror =
    (Boundary: ComponentClass<ErrorBoundaryProps> = IsomorphicErrorBoundary) =>
        <ComposedComponentProps extends {}>(InnerComponent: ComponentClass<ComponentProps>) => {

            if (Boundary && !Component.prototype.isPrototypeOf(Boundary.prototype)) {
                console.warn("Catch-React-Error: The <ErrorBoundary /> component doesn't extend React.Component.  ErrorBoundary must extends React.Component");
                Boundary = IsomorphicErrorBoundary
                return;
            }

            type ComposedComponentInstance = InstanceType<typeof InnerComponent>;

            type WrapperComponentProps = ComposedComponentProps

            type WrapperComponentPropsWithForwardedRef = WrapperComponentProps & {
                forwardedRef: Ref<ComposedComponentInstance>;
                children?: ReactNode;
            };

            class WrapperComponent extends Component<WrapperComponentPropsWithForwardedRef, {}>  {
                render() {
                    const {
                        forwardedRef,
                    } = this.props;
                    return (
                        <Boundary >
                            <InnerComponent {...this.props} ref={forwardedRef} />
                        </Boundary>
                    )
                }
            }

            return forwardRef<ComposedComponentInstance, WrapperComponentProps>(
                (props, ref) => <WrapperComponent forwardedRef={ref} {...props} />)
        }

export default catchreacterror