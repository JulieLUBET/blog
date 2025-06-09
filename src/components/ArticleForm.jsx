import { useState, useEffect } from "react";
import { Input, Button } from "antd";

export default function ArticleForm({ selectedArticle, handleClose, addArticle, updateArticle }) {
  const [titre, settitre] = useState(selectedArticle?.title || '');
  const [contenu, setcontenu] = useState(selectedArticle?.content || '');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(selectedArticle?.imageUrl || '');

  // Ajoute cet effet pour synchroniser les champs quand selectedArticle change
  useEffect(() => {
    settitre(selectedArticle?.title || '');
    setcontenu(selectedArticle?.content || '');
    setImage(null); // Réinitialise l'image lors de la modification
    setImageUrl(selectedArticle?.imageUrl || '');
  }, [selectedArticle]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case "titre":
        settitre(e.target.value);
        break;
      case "contenu":
        setcontenu(e.target.value);
        break;
      case "image":
        setImage(e.target.files[0]);
        break;
      case "imageUrl":
        setImageUrl(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUploadUrl = "";
    if (image) {
      // Upload de l'image sur Firebase Storage
      const storageRef = window.firebaseStorage.ref();
      const imgRef = storageRef.child(`images/${Date.now()}_${image.name}`);
      await imgRef.put(image);
      imageUploadUrl = await imgRef.getDownloadURL();
    } else {
      imageUploadUrl = imageUrl; // Utilise l'URL fournie si aucune nouvelle image n'est téléchargée
    }

    // Créé l'objet représentant l'article à modifier ou créer
    let article = {
      title: titre,
      content: contenu,
      createdAt: new Date(),
      comments: [],
      imageUrl: imageUploadUrl
    };

    // Si le composant reçoit la props d'un article sélectionné, c'est qu'il doit être modifié
    if(selectedArticle) {
      // On récupère les valeurs initiales de l'article à modifier
      article.id = selectedArticle.id;
      article.comments = selectedArticle.comments;
      updateArticle(article);
    } else { // Sinon, il doit être créé
      addArticle(article);
    }
    // Ferme la modale
    handleClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label htmlFor="titre">Titre</label>
        <Input
          type="text"
          name="titre"
          id="titre"
          placeholder="Titre de l article"
          value={titre}
          onChange={handleChange}
        />
        <label htmlFor="contenu">Contenu</label>
        <Input.TextArea
          name='contenu'
          id='contenu'
          placeholder='Ajouter votre contenu'
          value={contenu}
          onChange={handleChange}
        />
        <label htmlFor="imageUrl">URL de l'image</label>
        <Input
          type="text"
          name="imageUrl"
          id="imageUrl"
          placeholder="https://exemple.com/monimage.jpg"
          value={imageUrl}
          onChange={handleChange}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" htmlType="submit">
            {selectedArticle ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </>
  );
}
