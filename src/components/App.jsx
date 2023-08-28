import React, { useState, useEffect } from 'react';

import { SearchBar } from './Searchbar/Searchbar';
import Api from './Api';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { ImageGallery } from './ImageGallery/ImageGallery';

import css from './App.module.css';

export const App = () => {
  const [name, setName] = useState('');
  const [img, setImg] = useState([]);
  const [page, setPage] = useState(1);
  
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    imgModal: null,
    tags: '',
  });

  useEffect(() => {
    if (!name) {
      return;
    }

    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const images = await Api.images(name, page);

        if (images.hits.length === 0) {
          alert(`Sorry, ${name} was not found.`);
        }

        setImg(prevImages =>
          page === 1 ? images.hits : [...prevImages, ...images.hits]
        );
        setTotalPages(Math.floor(images.totalHits / 12));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [name, page]);

  const onSubmit = newName => {
    setName(newName);
    setPage(1);
    setImg([]);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const onClickModalOpen = (imgModal, modalTags) => {
    setModal({ isOpen: true, imgModal, tags: modalTags });
  };

  const onClickModalClose = () => {
    setModal({ isOpen: false, imgModal: null, tags: '' });
  };

  const clickBtn = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={onSubmit} />
      {img.length === 0 && (
        <h1 className={css.title}>Enter the data in the field</h1>
      )}
      {modal.isOpen && (
        <Modal
          onClose={onClickModalClose}
          imgModal={modal.imgModal}
          modalTags={modal.tags}
        />
      )}
      {error && (
        <p className={css.title}>Please, try again later. Error: {error}</p>
      )}
      <ImageGallery openModal={onClickModalOpen} items={img} />
      {img.length > 0 && page <= totalPages && (
        <button type="button" className={css.btn} onClick={clickBtn}>
          Load more
        </button>
      )}
      <Loader isLoading={isLoading} />
    </div>
  );
};
