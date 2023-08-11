'use client';
/* components */

/* components */


export interface Props {
    close: any;
    open: boolean;
    className?: string;
    children: React.ReactNode;
}

const Modal = ({ close ,open, className, children }: Props) => {
    return (
        <>
            <div onClick={close} className={`fixed top-0 left-0 right-0 bottom-0 ${open ? "backdrop-blur-[3px] bg-slate-600/20 pointer-events-auto" : "bg-black/0 pointer-events-none"} duration-150`}></div>
            <div className={`fixed flex w-fit h-fit top-[50%] bottom-[50%] left-2/4 translate-x-[-50%] translate-y-[-50%] z-50 ${className} ${open ? "opacity-1 scale-1 pointer-events-auto" : "opacity-0 scale-50 pointer-events-none"} duration-150`} >
                {children}
            </div>

        </>
    )
}
export default Modal;