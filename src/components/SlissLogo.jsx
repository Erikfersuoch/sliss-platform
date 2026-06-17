import logoUrl from "../assets/sliss-logo.png";

// Logo ufficiale Sliss (lockup orizzontale). La prop `size` = altezza in px;
// la larghezza segue da sola il rapporto reale dell'immagine (~3:1).
const SlissLogo = ({ size = 28 }) => (
  <img
    src={logoUrl}
    alt="Sliss"
    style={{ height: size, width: "auto", display: "block" }}
    draggable={false}
  />
);

export default SlissLogo;
