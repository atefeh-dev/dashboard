import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useContactsStore = defineStore("contacts", () => {
  // State
  const contacts = ref([
    {
      id: 1,
      name: "Pouriya Sadeghi",
      email: "pouriya@example.com",
      role: "Seller",
      avatar: "/av.png",
      type: "external",
      addedFrom: "workspace",
    },
    {
      id: 2,
      name: "MohammadAli Hariri",
      email: "mohammad@example.com",
      role: "Buyer",
      avatar: "/av.png",
      type: "external",
      addedFrom: "workspace",
    },
    {
      id: 3,
      name: "Atefeh Mohammaddust",
      email: "atefeh@example.com",
      role: "Consultant",
      avatar: "/av.png",
      type: "external",
      addedFrom: "contacts",
    },
    {
      id: 4,
      name: "John Doe",
      email: "john@example.com",
      role: "Manager",
      avatar: "/av.png",
      type: "external",
      addedFrom: "contacts",
    },
    {
      id: 5,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Director",
      avatar: "/av.png",
      type: "external",
      addedFrom: "contacts",
    },
  ]);

  const loading = ref(false);
  const error = ref(null);

  // Getters
  const allContacts = computed(() => contacts.value);

  const internalContacts = computed(() =>
    contacts.value.filter((c) => c.type === "internal")
  );

  const externalContacts = computed(() =>
    contacts.value.filter((c) => c.type === "external")
  );

  // Format for AppSelect dropdown
  const contactOptions = computed(() =>
    contacts.value.map((contact) => ({
      value: contact.id,
      label: `${contact.name} (${contact.email})`,
    }))
  );

  // Actions
  async function fetchContacts() {
    loading.value = true;
    error.value = null;

    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/contacts');
      // contacts.value = response.data;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      return contacts.value;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function getContactById(id) {
    return contacts.value.find((c) => c.id === id);
  }

  function getContactsByIds(ids) {
    return contacts.value.filter((c) => ids.includes(c.id));
  }

  async function addContact(contactData) {
    loading.value = true;
    error.value = null;

    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/contacts', contactData);
      // const newContact = response.data;

      const newContact = {
        id: Date.now(),
        ...contactData,
        avatar: "/av.png",
        addedFrom: "manual",
      };

      contacts.value.push(newContact);
      return newContact;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateContact(id, updates) {
    loading.value = true;
    error.value = null;

    try {
      // TODO: Replace with actual API call
      // const response = await api.patch(`/contacts/${id}`, updates);

      const index = contacts.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        contacts.value[index] = { ...contacts.value[index], ...updates };
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteContact(id) {
    loading.value = true;
    error.value = null;

    try {
      // TODO: Replace with actual API call
      // await api.delete(`/contacts/${id}`);

      const index = contacts.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        contacts.value.splice(index, 1);
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function searchContacts(query) {
    const lowerQuery = query.toLowerCase();
    return contacts.value.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.email.toLowerCase().includes(lowerQuery) ||
        contact.role.toLowerCase().includes(lowerQuery)
    );
  }

  return {
    // State
    contacts,
    loading,
    error,

    // Getters
    allContacts,
    internalContacts,
    externalContacts,
    contactOptions,

    // Actions
    fetchContacts,
    getContactById,
    getContactsByIds,
    addContact,
    updateContact,
    deleteContact,
    searchContacts,
  };
});
