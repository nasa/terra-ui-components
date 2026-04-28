import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    /* Navbar container */
    .navbar {
        background-color: #333;
        font-family: Arial, sans-serif;
    }

    .nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
    }

    /* Links inside the navbar */
    .navbar a {
        display: block;
        font-size: 16px;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
    }

    /* Visible focus indicator */
    .navbar a:focus,
    .dropdown .dropbtn:focus {
        outline: 3px solid #4a9eff;
        outline-offset: -3px;
    }

    /* The dropdown container */
    .dropdown {
        position: relative;
    }

    /* Dropdown button */
    .dropdown .dropbtn {
        font-size: 16px;
        border: none;
        color: white;
        padding: 14px 16px;
        background-color: inherit;
        font-family: inherit;
        cursor: pointer;
        display: block;
    }

    /* Show dropdown on hover OR when button has aria-expanded="true" */
    .dropdown:hover .dropdown-content,
    .dropdown .dropbtn[aria-expanded='true'] + .dropdown-content {
        display: block;
    }

    /* Update button styling to show active state */
    .dropdown:hover .dropbtn,
    .dropdown .dropbtn[aria-expanded='true'] {
        background-color: red;
    }

    /* Hover and focus states */
    .navbar a:hover,
    .navbar a:focus,
    .dropdown .dropbtn:hover,
    .dropdown .dropbtn:focus {
        background-color: red;
    }

    /* Dropdown content (hidden by default) */
    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        width: 100vw;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    }

    /* Show dropdown when button has aria-expanded="true" */
    .dropdown .dropbtn[aria-expanded='true'] + .dropdown-content {
        display: block;
    }

    /* Mega Menu header */
    .dropdown-content .header {
        background: red;
        padding: 16px;
        color: white;
    }

    /* Columns */
    .row {
        display: flex;
        gap: 0;
    }

    .column {
        flex: 1;
        padding: 10px;
        background-color: #ccc;
        min-height: 250px;
    }

    .column h3 {
        margin-top: 0;
        color: #333;
    }

    .column ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    /* Links inside columns */
    .column a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        text-align: left;
    }

    .column a:hover,
    .column a:focus {
        background-color: #ddd;
    }
`
