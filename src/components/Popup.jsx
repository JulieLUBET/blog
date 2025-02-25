/* eslint-disable react/prop-types */
import { Modal } from "antd";


const Popup = (props) => {
  return (
    <Modal
      title="Rédiger un article"
      open={props.isPopup}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
    >
    <p>Le formulaire devra apparaître ici…</p>
    </Modal>
  );
};

export default Popup;
