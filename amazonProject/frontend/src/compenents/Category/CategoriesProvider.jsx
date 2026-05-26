import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCategories } from "../../Api/catalogApi.js";

const CategoriesContext = createContext({
  categories: [],
  isLoading: true,
});

export function useCategoriesContext() {
  return useContext(CategoriesContext);
}

/** Shared category list for Header / LowerHeader (slug + display name). */
export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((rows) => {
        setCategories(
          rows.map((c) => ({
            slug: c.name,
            name: c.title,
          })),
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories for header:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, isLoading }}>
      {children}
    </CategoriesContext.Provider>
  );
}
