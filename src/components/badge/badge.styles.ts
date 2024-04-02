import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: max(12px, 0.75em);
    font-weight: var(--gd-font-weight-semibold);
    letter-spacing: var(--gd-letter-spacing-normal);
    line-height: 1;
    border-radius: var(--gd-border-radius-small);
    border: solid 1px var(--gd-color-neutral-0);
    white-space: nowrap;
    padding: 0.35em 0.6em;
    user-select: none;
    -webkit-user-select: none;
    cursor: inherit;
  }

  /* Variant modifiers */
  .badge--primary {
    background-color: var(--gd-color-primary-600);
    color: var(--gd-color-neutral-0);
  }

  .badge--success {
    background-color: var(--gd-color-success-600);
    color: var(--gd-color-neutral-0);
  }

  .badge--neutral {
    background-color: var(--gd-color-neutral-600);
    color: var(--gd-color-neutral-0);
  }

  .badge--warning {
    background-color: var(--gd-color-warning-600);
    color: var(--gd-color-neutral-0);
  }

  .badge--danger {
    background-color: var(--gd-color-danger-600);
    color: var(--gd-color-neutral-0);
  }

  /* Pill modifier */
  .badge--pill {
    border-radius: var(--gd-border-radius-pill);
  }

  /* Pulse modifier */
  .badge--pulse {
    animation: pulse 1.5s infinite;
  }

  .badge--pulse.badge--primary {
    --pulse-color: var(--gd-color-primary-600);
  }

  .badge--pulse.badge--success {
    --pulse-color: var(--gd-color-success-600);
  }

  .badge--pulse.badge--neutral {
    --pulse-color: var(--gd-color-neutral-600);
  }

  .badge--pulse.badge--warning {
    --pulse-color: var(--gd-color-warning-600);
  }

  .badge--pulse.badge--danger {
    --pulse-color: var(--gd-color-danger-600);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--pulse-color);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }
`;
