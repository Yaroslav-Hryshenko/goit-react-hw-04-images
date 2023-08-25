import { Component } from 'react';

import { SearchBar } from './Searchbar/Searchbar';
// import { Button } from './Button/Button';
import Api from './Api';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { ImageGallery } from './ImageGallery/ImageGallery';


import css from './App.module.css';

export class App extends Component {
  state = {
    name: '',
    img: [],
    page: 1,
    tags: '',
    totalPages: 0,
    isLoading: false,
    error: null,
    modal: { isOpen: false, imgModal: null, tags: '' },
  };

  componentDidUpdate(prevProps, prevState) {
    const { name, page } = this.state;
    if (prevState.name !== name || prevState.page !== page) {
      this.fetchImages();
    }
  }

  fetchImages = async () => {
    const { name, page } = this.state;

    this.setState({ isLoading: true });
    try {
      const images = await Api.images(name, page);

      if (images.hits.length === 0) {
        alert(`Sorry, ${name} was not found.`);
      }

      this.setState(prevState => ({
        img: [...prevState.img, ...images.hits],
        totalPages: Math.floor(images.totalHits / 12),
      }));
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onSubmit = name => {
    this.setState({ name, page: 1, img: [] });
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  onClickModalOpen = (img, tags) => {
    this.setState({ modal: { isOpen: true, imgModal: img, tags } });
  };

  onClickModalClose = () => {
    this.setState({ modal: { isOpen: false, imgModal: null, tags: '' } });
  };

  clickBtn = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    const { img, page, modal, isLoading, error, totalPages } = this.state;
    

    return (
      <div className={css.app}>
        <SearchBar onSubmit={this.onSubmit} />
        {img.length === 0 && (
          <h1 className={css.title}>Enter the data in the field</h1>
        )}
        {modal.isOpen && (
          <Modal
            onClose={this.onClickModalClose}
            imgModal={modal.imgModal}
            modalTags={modal.tags}
          />
        )}
        {error && (
          <p className={css.title}>Please, try again later. Error: {error}</p>
        )}
        <ImageGallery openModal={this.onClickModalOpen} items={img} />
        {img.length > 0 && page <= totalPages && (
          <button type="button" className={css.btn} onClick={this.clickBtn}>
            Load more
          </button>
        )}
        <Loader isLoading={isLoading} />
      </div>
    );
  }
}
