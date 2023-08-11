'use client';
/* components */

/* components */

export interface Props {
    open: boolean;
    className?: string;
    children: React.ReactNode;
}

const LoadingModal = ({ open, className, children }: Props) => {

    return (

        <div className={`fixed top-0 left-0 right-0 bottom-0 z-[99] ${open ? "opacity-1 pointer-events-auto translate-x-0 " : "opacity-0 translate-x-full pointer-events-none"} duration-200 ${className}`}>
            {children}
        </div>

    )
    
}

export default LoadingModal;