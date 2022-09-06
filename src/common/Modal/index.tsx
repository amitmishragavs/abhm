import { Modal as AModal } from 'antd';

function Modal({ visible = false, children, ...props }: any) {
    return (
        <AModal destroyOnClose  visible={visible} footer={false} {...props}>
            {children}
        </AModal>
    )
}

export default Modal