import Image from 'next/image';
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <Image src="/images/logo-mega-invest-2.png" alt="Mega Invest Logo" width={200} height={50} className={styles.logo} />
        <h1>Stranica je trenutno u izradi</h1>
        <p>Hvala na strpljenju.</p>
        
        <div className={styles.contactInfo}>
          <h2>Kontakt informacije</h2>
          <p><strong>Mega Invest d.o.o.</strong></p>
          <p>Put Gvozdenova 283, 22000 Šibenik</p>
          
          <div className={styles.contactRow}>
            <div className={styles.contactLabel}>MB:</div>
            <div className={styles.contactValue}>05728711</div>
          </div>
          
          <div className={styles.contactRow}>
            <div className={styles.contactLabel}>OIB:</div>
            <div className={styles.contactValue}>94198216157</div>
          </div>
          
          <div className={styles.contactRow}>
            <div className={styles.contactLabel}>Tel:</div>
            <div className={styles.contactValue}>
              <Link href="tel:+385913101512">+385 91 310 15 12</Link>
            </div>
          </div>
          
          <div className={styles.contactRow}>
            <div className={styles.contactLabel}>Mail:</div>
            <div className={styles.contactValue}>
              <Link href="mailto:info@mega-invest.hr">info@mega-invest.hr</Link>
            </div>
          </div>
          
          <div className={styles.contactRow}>
            <div className={styles.contactLabel}>SWIFT:</div>
            <div className={styles.contactValue}>HAABHR22</div>
          </div>
          
          <div className={styles.contactRow}>
            <div className={styles.contactLabel}>IBAN:</div>
            <div className={styles.contactValue}>HR58 2500 0091 1015 5216 2</div>
          </div>
        </div>
        <Link href="/" className={styles.btn}>Početna stranica</Link>
      </div>
    </div>
  );
}
