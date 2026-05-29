/*Tela em Desenvolvimento!!!!!*/
import Clergycard from '../(components)/clergycard';

export default function Clergydetails() {
  const clergy = {
    name: 'Altair Santos',
    role: 'Pároco',
    photoUrl:
      'https://images.pexels.com/photos/28143097/pexels-photo-28143097/free-photo-of-igreja-capela-catedral-retrato.jpeg',
  };

  return (
    <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <div className="w-80 flex justify-start ">
        <img
          src={clergy.photoUrl}
          alt={clergy.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <p>{clergy.name}</p>
        <p>{clergy.role}</p>
      </div>
      <div className="flex justify-between">
        <h1>biografia</h1>
        <p></p>
      </div>
    </main>
  );
}
