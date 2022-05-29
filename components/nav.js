import Link from 'next/link'
import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav, NavDropdown} from "react-bootstrap";
import Image from 'next/image'
import clientAdmin from "../images/clientAdmin.png";
import consumerAdmin from "../images/consumerAdmin.png";
import contentAdmin from "../images/contentAdmin.png";
import deliveryAdmin from "../images/deliveryAdmin.png";
import DAM from "../images/DAM.png";

const Menu = () => {
  return (
    <div className="h-25 p-3 text-light bg-dark">
      <Nav variant="pills" activeKey="1">
        <NavDropdown title="DAM" id="nav-dropdown">
          <NavDropdown.Item href="https://content.admin.amuniversal.com/">
          <Image src={contentAdmin} />{' '}Content Admin
            </NavDropdown.Item>
          <NavDropdown.Item href="https://client.admin.amuniversal.com/">
          <Image src={clientAdmin} />{' '}Client Admin
            </NavDropdown.Item>
          <NavDropdown.Item href="https://consumer.admin.amuniversal.com/">
          <Image src={consumerAdmin} />{' '}Consumer Admin{' '}
            </NavDropdown.Item>
          <NavDropdown.Item href="http://delivery.amuniversal.com/admin">
          <Image src={deliveryAdmin} />{' '}Delivery Admin
            </NavDropdown.Item>
          <NavDropdown.Item href="https://site.admin.amuniversal.com/">
          <Image src={DAM} />{' '}DAM
            </NavDropdown.Item>
        </NavDropdown>
        <Nav.Item>
          <Nav.Link eventKey="home" href="https://content.admin.amuniversal.com/metadata/features">
          Feature
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="review" href="https://content.admin.amuniversal.com/metadata/review">
          Review
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="user_list" href="https://content.admin.amuniversal.com/metadata/user_list">
          User List
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="sign_out" href="https://content.admin.amuniversal.com/users/sign_out">
          Sign out
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  )
}

export default Menu
