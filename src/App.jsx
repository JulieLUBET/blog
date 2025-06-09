import "./App.css";
import AddButton from "./components/AddButton";
import ArticleModal from "./components/ArticleModal";
import { useState, useEffect } from "react";
import { Spin, Card, Tooltip, Modal, Image } from "antd";
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { getArticles, deleteArticle } from '../Fire';
import { db } from '../Fire';
import { DeleteOutlined, EditOutlined, EyeOutlined, MenuOutlined, CloseOutlined, FacebookFilled, InstagramFilled, YoutubeFilled } from '@ant-design/icons';

function App() {
  // ------------------- ÉTATS -------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [search, setSearch] = useState("");
  const [viewArticle, setViewArticle] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewImage, setViewImage] = useState(null);

  // ------------------- CHARGEMENT DES ARTICLES -------------------
  useEffect(() => {
    getArticles(posts => {
      setArticles(posts);
      setLoading(false);
    });
  }, []);

  // ------------------- CRUD ARTICLES -------------------
  const addArticle = (article) => {
    addDoc(collection(db, 'articles'), article);
  };

  const updateArticle = (article) => {
    updateDoc(doc(db, 'articles', article.id), article)
      .then(() => {
        setArticles(prevArticles =>
          prevArticles.map(a => a.id === article.id ? { ...a, ...article } : a)
        );
      });
  };

  const removeArticle = (article) => {
    Modal.confirm({
      title: "Supprimer l'article",
      content: "Es-tu sûr de vouloir supprimer cet article ? Cette action est irréversible.",
      okText: "Oui, supprimer",
      okType: "danger",
      cancelText: "Annuler",
      centered: true,
      className: "custom-delete-modal",
      maskStyle: { background: "rgba(255,126,95,0.10)" },
      bodyStyle: { borderRadius: 16, padding: 24 },
      onOk() {
        return deleteArticle(article)
          .then(() => {
            setArticles(prevArticles => prevArticles.filter(a => a.id !== article.id));
          })
          .catch((error) => {
            Modal.error({
              title: "Erreur",
              content: "Erreur lors de la suppression de l'article : " + error.message,
            });
          });
      }
    });
  };

  // ------------------- FILTRAGE & TRI DES ARTICLES -------------------
  const filteredArticles = articles
    .filter(article =>
      article.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = a.createdAt?.seconds
        ? a.createdAt.seconds * 1000
        : new Date(a.createdAt).getTime();
      const dateB = b.createdAt?.seconds
        ? b.createdAt.seconds * 1000
        : new Date(b.createdAt).getTime();
      return dateB - dateA; // du plus récent au plus ancien
    });

  return (
    <>
      {/* ------------------- NAVBAR ------------------- */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src="/images/jl.png" alt="Logo Univers Yuna" />
          <span>Univers Yuna</span>
        </div>
        <ul className="navbar-links">
          <li className="hide-on-mobile">
            <a
              href="https://jlubet.myportfolio.com/work"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          </li>
        </ul>
        <div className="navbar-socials hide-on-mobile">
          <a href="https://www.facebook.com/Univers.Yuna/" target="_blank" rel="noopener noreferrer">
            <FacebookFilled className="social-icon facebook" />
          </a>
          <a href="https://www.instagram.com/univers.yuna/" target="_blank" rel="noopener noreferrer">
            <InstagramFilled className="social-icon instagram" />
          </a>
          <a href="https://www.youtube.com/@universyuna5667" target="_blank" rel="noopener noreferrer">
            <YoutubeFilled className="social-icon youtube" />
          </a>
        </div>
        <button className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
        {menuOpen && (
          <div className="mobile-menu">
            <button className="close-mobile-menu" onClick={() => setMenuOpen(false)}>
              <CloseOutlined />
            </button>
            <a
              href="https://jlubet.myportfolio.com/work"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Portfolio
            </a>
            <div className="mobile-socials">
              <a href="https://www.facebook.com/Univers.Yuna/" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
                <FacebookFilled className="social-icon facebook" />
              </a>
              <a href="https://www.instagram.com/univers.yuna/" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
                <InstagramFilled className="social-icon instagram" />
              </a>
              <a href="https://www.youtube.com/@universyuna5667" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
                <YoutubeFilled className="social-icon youtube" />
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ------------------- LOGOS & TITRE ------------------- */}
      <div>
        <img src="/images/jl.png" className="logo" alt="Vite logo" />
        <img src="/images/logo.png" className="logo react" alt="React logo"/>
      </div>
      <h1>Univers Yuna</h1>

      {/* ------------------- BARRE D'AJOUT & RECHERCHE ------------------- */}
      <div className="card">
        <AddButton
          title="Publier un article"
          onClick={() => setIsModalOpen(true)}
        />
        <input
          type="text"
          className="search-bar"
          placeholder="Rechercher par titre de l'article..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <ArticleModal
          isOpen={isModalOpen}
          handleOk={() => {
            setIsModalOpen(false);
            setSelectedArticle(null);
          }}
          handleCancel={() => {
            setIsModalOpen(false);
            setSelectedArticle(null);
          }}
          addArticle={addArticle}
          updateArticle={updateArticle}
          removeArticle={removeArticle}
          selectedArticle={selectedArticle}
        />
      </div>

      {/* ------------------- LISTE DES ARTICLES ------------------- */}
      {loading ? (
        <Spin />
      ) : (
        <div className="articles-list">
          {filteredArticles.map(article => (
            <Card
              key={article.id}
              title={article.title}
              bordered={false}
              className="article-card"
            >
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt="illustration"
                  className="article-image"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (window.innerWidth <= 600) setViewImage(article.imageUrl);
                  }}
                />
              )}
              <p>{article.content}</p>
              <p className="article-date">
                {article.createdAt
                  ? new Date(
                      article.createdAt.seconds
                        ? article.createdAt.seconds * 1000
                        : article.createdAt
                    ).toLocaleDateString('fr-FR') +
                    " à " +
                    new Date(
                      article.createdAt.seconds
                        ? article.createdAt.seconds * 1000
                        : article.createdAt
                    ).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                  : ""}
              </p>
              <div className="article-actions">
                <Tooltip title="Supprimer">
                  <button
                    onClick={() => removeArticle(article)}
                    className="icon-btn delete"
                  >
                    <DeleteOutlined />
                  </button>
                </Tooltip>
                <Tooltip title="Modifier">
                  <button
                    onClick={() => {
                      setSelectedArticle(article);
                      setIsModalOpen(true);
                    }}
                    className="icon-btn edit"
                  >
                    <EditOutlined />
                  </button>
                </Tooltip>
                <Tooltip title="Visualiser">
                  <button
                    onClick={() => setViewArticle(article)}
                    className="icon-btn view hide-on-mobile-col"
                  >
                    <EyeOutlined />
                  </button>
                </Tooltip>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ------------------- MODALE DE VISUALISATION DE L'ARTICLE ------------------- */}
      <Modal
        open={!!viewArticle}
        footer={null}
        onCancel={() => setViewArticle(null)}
        centered
        width={420}
      >
        {viewArticle && (
          <div className="modal-article">
            {viewArticle.imageUrl && (
              <Image
                width={320}
                src={viewArticle.imageUrl}
                alt="illustration"
                className="modal-article-image"
              />
            )}
            <h2 className="modal-article-title">{viewArticle.title}</h2>
            <p className="modal-article-date">
              {viewArticle.createdAt
                ? new Date(
                    viewArticle.createdAt.seconds
                      ? viewArticle.createdAt.seconds * 1000
                      : viewArticle.createdAt
                  ).toLocaleDateString("fr-FR") +
                  " à " +
                  new Date(
                    viewArticle.createdAt.seconds
                      ? viewArticle.createdAt.seconds * 1000
                      : viewArticle.createdAt
                  ).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })
                : ""}
            </p>
            <div className="modal-article-content">{viewArticle.content}</div>
          </div>
        )}
      </Modal>

      {/* ------------------- MODALE D'AGRANDISSEMENT D'IMAGE ------------------- */}
      <Modal
        open={!!viewImage}
        footer={null}
        onCancel={() => setViewImage(null)}
        centered
        width="95vw"
        bodyStyle={{ padding: 0, textAlign: 'center', background: '#fff' }}
      >
        <img
          src={viewImage}
          alt="Agrandissement"
          style={{ width: '100%', maxWidth: '95vw', maxHeight: '80vh', objectFit: 'contain' }}
        />
      </Modal>
    </>
  );
}

export default App;
