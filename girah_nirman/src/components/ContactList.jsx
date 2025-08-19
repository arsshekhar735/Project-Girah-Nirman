import React from "react";
import ContactRow from "./ContactRow"; // Adjust path as needed

function ContactList({ contacts, token }) {
  return (
    <div>
      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        contacts.map((c) => <ContactRow key={c.id} contact={c} token={token} />)
      )}
    </div>
  );
}

export default ContactList;
