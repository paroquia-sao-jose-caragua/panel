'use client';

import { PastoralCard } from "./card";


const pastorals = [{
  id: crypto.randomUUID(),
  name: "Pastoral da Família",
  coverUrl: 'https://images.unsplash.com/photo-1777377772858-f9a04561ae3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8'
}]

export const PastoralsList = () => {

  return (
    <>
      {
        pastorals
          .map((pastoral) => (
            <PastoralCard key={pastoral.id} pastoral={pastoral} />
          ))
      }
    </>
  );
};
