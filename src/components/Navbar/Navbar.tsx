import Link from 'next/link';

export default function Navbar() {
   return (
      <div className="navbar-main-container">
         <ul className="links-list">
            <li>
               <Link href="/">Homepage</Link>
            </li>
            <li>
               <Link href="/characters/1">Characters</Link>
            </li>
            <li>
               <Link href="/episodes/1">Episodes</Link>
            </li>
            <li>
               <Link href="/locations/1">Locations</Link>
            </li>
         </ul>
      </div>
   );
}
