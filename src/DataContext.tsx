import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { defaultData } from './defaultData';

const DataContext = createContext<any>(null);

/**
 * Deep merges source into target. If a key exists in target but not in source,
 * the target value is preserved. This ensures defaultData always fills gaps.
 */
function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return source !== undefined ? source : target;
  }
  if (!target || typeof target !== 'object' || Array.isArray(target)) {
    return source;
  }

  const result: any = { ...target };
  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      typeof target[key] === 'object' &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<any>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Firebase fetch happens silently in the background
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'website', 'content');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const merged = deepMerge(defaultData, docSnap.data());
          setData(merged);
        } else {
          await setDoc(docRef, defaultData).catch(() => {});
        }
      } catch (error) {
        // Silently fail - website already works with defaultData
        console.warn("Firebase unavailable, using local data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
