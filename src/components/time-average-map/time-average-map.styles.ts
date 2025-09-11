import { css } from 'lit';

export default css`
  :host {
    display: block;
    height: 800px;
  }

  #map {
    position: relative;
    width: 100%;
    height: 100%;
  }

  dialog {
        opacity: 1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
    }
`;