import { Modal } from "antd";
import ArticleForm from "./ArticleForm";

const ArticleModal = (props) => {
  return (
    <Modal
      title="Rédiger un article"
      open={props.isOpen}
      onCancel={props.handleCancel}
      footer={null}
    >
    <ArticleForm
      handleClose={props.handleCancel} // pour fermer la modale après soumission
      selectedArticle={props.selectedArticle} // si tu veux gérer l’édition plus tard
      addArticle={props.addArticle}
      updateArticle={props.updateArticle}
    />
    </Modal>
  );
};

export default ArticleModal;
