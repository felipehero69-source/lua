import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "3rem", color: "#F7F3EA" }}>Lua 🌙</h1>
          <p style={{ fontSize: "1.2rem", color: "#D8BC70" }}>Sua assistente de sono infantil</p>
        </div>

        <div style={{ 
          background: "#56629A", 
          padding: "2rem", 
          borderRadius: "16px", 
          color: "#F7F3EA",
          textAlign: "center",
          maxWidth: "400px"
        }}>
          <p style={{ marginBottom: "1.5rem", lineHeight: "1.6" }}>
            Olá! Eu sou a Lua. Estou aqui para ajudar você a entender melhor o sono do seu bebê e construir uma rotina mais tranquila.
          </p>
          <Link href="/login">
            <button style={{
              background: "#1E2352",
              color: "#FFFFFF",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "1.1rem",
              cursor: "pointer",
              fontWeight: "bold"
            }}>
              Começar
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
