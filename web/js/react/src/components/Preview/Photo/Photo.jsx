import React, { Component } from 'react';
import classNames from 'classname';
import * as FM from '../../../FileManagerHelper';
import './Photo.scss';
import Spinner from '../../Spinner/Spinner';

class Photo extends Component {
  state = {
    activeSlide: 0,
    photoGallery: [],
    loading: false
  }

  imgClass = (item) => {
    if (item.match(/.gif/i)) {
      return "gif";
    } else {
      return "img";
    }
  }

  encodePath = (path) => {
    let splitPath = path.split('/');
    splitPath.splice(splitPath.length - 1, 1);
    splitPath.splice(0, 1);
    return splitPath.join('%2F');
  }

  formatPath = (path) => {
    let splitPath = path.split('/');
    splitPath.splice(splitPath.length - 1, 1);
    return splitPath.join('/');
  }

  carouselIndicators = () => {
    const gallery = this.state.photoGallery;
    return gallery.map((item, i) => {
      const imageClasses = classNames({ 'control-photo': true, 'active': i === this.state.activeSlide });
      const result = (<div data-target="#photoGallery" data-slide-to={i} key={i} className="indicator">
        <img src={`${window.location.origin}/api/v1/view/file/${this.formatPath(this.props.path)}/${item}&raw=true`} alt={i} className={imageClasses} />
      </div>);
      return result;
    });
  }

  carouselPhotos = () => {
    const gallery = this.state.photoGallery || [];
    return gallery.map((item, i) => (
      <div className={i === this.state.activeSlide ? 'carousel-item active' : 'carousel-item'} key={i}>
        <div className="d-flex align-items-center justify-content-center min-vh-100">
          <img className={this.imgClass(item)} src={`${window.location.origin}/api/v1/view/file/${this.formatPath(this.props.path)}/${item}&raw=true`} alt={i} />
        </div>
      </div>
    ));
  }

  setStateAsync = updater => new Promise(resolve => this.setState(updater, resolve));

  setPhotoGallery = async () => {
    await this.setStateAsync({ loading: true });
    const result = await FM.getData(this.encodePath(this.props.path));
    let photoGallery = [...this.state.photoGallery];
    result.data.listing.filter(item => item.name.match(/.png|.jpg|.jpeg|.gif/g) && !item.name.match(/.zip|.tgz|.tar.gz|.gzip|.tbz|.tar.bz|.gz|.zip|.tar|.rar/g) ? photoGallery.push(item.name) : null)
    await this.setStateAsync({ photoGallery, loading: false })
    this.setActiveImage();
  }

  setActiveImage = () => {
    let activeImage = this.props.activeImage;
    let activeImageIndex = this.state.photoGallery.indexOf(activeImage);
    this.setState({ activeSlide: activeImageIndex });
  }

  componentDidMount() {
    this.setPhotoGallery();
  }

  render() {
    return (
      <div>
        {this.state.loading ? <Spinner /> :
          <div id="photoGallery" className="carousel slide" data-ride="carousel">
            <span className="close" onClick={this.props.close}>&times;</span>
            <div className="carousel-inner">
              {this.carouselPhotos()}
            </div>
            <div className="carousel-indicators">
              {this.carouselIndicators()}
            </div>
            <a className="carousel-control-prev" href="#photoGallery" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#photoGallery" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        }
      </div>
    );
  }
}

export default Photo;