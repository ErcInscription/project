"use client";
import "./ContactUs.css"
import { useState, useEffect } from "react";

export default function ContactUs() {
  const [textContent, setTextContent] = useState("");

  function showErrorMessage() {
    // setTextContent('Coming Soon');
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'block';
  }
  return (
    <div className="about mb-5">
      <div className="contact-container">
        <div className="contact-title">Contact Us</div>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea rows="5" placeholder="Your Message" required></textarea>
          <button type="submit" onclick={() => {
            showErrorMessage();
          }}>Send Message</button>
        </form>
        <div id="error-message" className="error-message">
          Coming Soon
        </div>
      </div>
    </div>
  )
}