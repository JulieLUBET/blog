import "./App.css";
import AddButton from "./components/AddButton";
import ArticleModal from "./components/ArticleModal";
import { useState, useEffect } from "react";
import { Spin, Card, Tooltip, Modal, Image } from "antd";
import { addDoc, collection, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { getArticles } from '../Fire';
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
  const [showArchives, setShowArchives] = useState(false);
  const [archives, setArchives] = useState([]);

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
    let codeInput = "";
    Modal.confirm({
      title: "Suppression d'un article",
      content: (
        <div>
          <p>Pour supprimer cet article, entrez le code de confirmation.</p>
          <input
            type="password"
            placeholder="Code de confirmation"
            onChange={e => codeInput = e.target.value}
            style={{ width: "100%", marginTop: 8, padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
      ),
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      centered: true,
      onOk() {
        if (codeInput === "0000") {
          return addDoc(collection(db, 'archives'), article)
            .then(() => deleteDoc(doc(db, 'articles', article.id)))
            .then(() => {
              setArticles(prevArticles => prevArticles.filter(a => a.id !== article.id));
            })
            .catch((error) => {
              Modal.error({
                title: "Erreur",
                content: "Erreur lors de la suppression de l'article : " + error.message,
              });
            });
        } else {
          Modal.error({
            title: "Code incorrect",
            content: "Le code de confirmation est incorrect. Suppression annulée.",
          });
          return Promise.reject();
        }
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

  const fetchArchives = async () => {
    const snapshot = await getDocs(collection(db, 'archives'));
    setArchives(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

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
              className="navbar-btn"
            >
              Portfolio
            </a>
          </li>
          <li>
            <button
              className="navbar-btn"
              onClick={() => {
                setShowArchives(true);
                fetchArchives();
              }}
            >
              Archives
            </button>
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
              className="navbar-btn"
            >
              Portfolio
            </a>
            <button
              className="navbar-btn"
              onClick={() => {
                setShowArchives(true);
                fetchArchives();
                setMenuOpen(false);
              }}
            >
              Archives
            </button>
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

      {/* ------------------- AFFICHAGE PRINCIPAL ------------------- */}
      {showArchives ? (
        <div className="archives-container">
          <h2>Archives des articles supprimés</h2>
          <button className="navbar-btn archives-return-btn" onClick={() => setShowArchives(false)}>
            Retour aux articles
          </button>
          <div className="archives-table-wrapper">
            {archives.length === 0 ? (
              <p>Aucune archive.</p>
            ) : (
              <table className="archives-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Date</th>
                    <th>Contenu</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {archives
                    .slice()
                    .sort((a, b) => {
                      const dateA = a.createdAt?.seconds
                        ? a.createdAt.seconds * 1000
                        : new Date(a.createdAt).getTime();
                      const dateB = b.createdAt?.seconds
                        ? b.createdAt.seconds * 1000
                        : new Date(b.createdAt).getTime();
                      return dateB - dateA; // du plus récent au plus ancien
                    })
                    .map(article => (
                      <tr key={article.id}>
                        <td>{article.title}</td>
                        <td>
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
                        </td>
                        <td className="archives-content-cell">
                          {article.content}
                        </td>
                        <td>
                          {article.imageUrl && (
                            <img
                              src={article.imageUrl}
                              alt="illustration"
                              className="archives-img"                            />
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <>
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
                      onClick={() => setViewImage(article.imageUrl)}
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
            <Image
              src={viewImage}
              alt="Agrandissement"
              style={{ width: '100%', maxWidth: '95vw', maxHeight: '80vh', objectFit: 'contain' }}
            />
          </Modal>
        </>
      )}
    </>
  );
}

export default App;
