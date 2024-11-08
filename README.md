# AI-Driven Bildsökare och Bildgenerator

## **Översikt**

Denna applikation är en AI-driven bildsökare, byggd med modern teknikstack som inkluderar **Extas 15**, **React 19**, **Tailwind CSS**, och **Shadcn**. Appen gör det möjligt för användare att få relevanta bildresultat från Pexels genom att beskriva deras behov i naturligt språk. Med AI hjälp förbättras söktermerna för att optimera träffarna och hämta de mest relevanta bilderna för användaren. Om inga relevanta resultat hittas, kan användaren generera en anpassad bild genom en inbyggd AI-bildgenerator.

## **Hur Appen Fungerar**

Appen följer ett intuitivt och enkelt flöde som inkluderar sökning, filtrering, och generering av bilder. Här är en steg-för-steg överblick över appens funktionalitet och hur användare kan interagera med de olika verktygen.

### **1. Användarens Inmatning**

Användaren börjar med att beskriva sitt bildbehov i ett sökformulär. De kan skriva in naturliga beskrivningar som exempelvis: ”Jag behöver en bild för ett konstgalleri-event, med ljusa och moderna färger, helst i liggande format”.

### **2. AI-Optimering av Sökparametrar**

När användaren har fyllt i sin beskrivning används en AI-modell för att förbättra söktermen och skapa optimala parametrar för bildsökning i Pexels API. AI tar in den beskrivande texten och skapar:

- En **förbättrad sökterm** som är mer specifik och ändamålsenlig.
- Rekommenderade **API-parametrar** som orientering (t.ex. liggande eller stående), färgfilter, och andra relevanta inställningar.

### **3. Resultat Från Pexels API**

Den förbättrade söktermen och de genererade API-parametrarna används för att söka efter bilder via **Pexels API**. Resultaten visas sedan i ett responsivt bildgalleri där användaren kan:

- **Se bilderna** i olika storlekar och vinklar.
- **Filtrera** resultaten ytterligare baserat på färg, orientering, eller ämne.
- **Spara** eller **boka märka** bilder som de gillar.

### **4. Generera En Egen Bild (Om Inga Bilder Finns)**

Om användaren inte hittar en bild som uppfyller deras behov, erbjuder appen en möjlighet att generera en egen bild. Detta sker genom att klicka på knappen **"Skapa Egen Passande Bild med AI"**.

- **Bildgenereringsprocess**:
  - En **popup-ruta** öppnas där användaren kan välja mellan förutbestämda stilar för bilden:
    - **Minimalistisk Modern**
    - **Klassisk och Elegant**
    - **Färgglad och Lekfull**
    - (Eventuellt en fjärde stil, beroende på framtida behov)
  - Användaren klickar i den stil som passar bäst för deras ändamål.
  - AI tar in användarens ursprungliga beskrivning tillsammans med den valda stilen för att skapa en **AI-genererad bild** som är unik och specialanpassad.

### **5. Visning och Hantering av Bilder**

Efter att en bild har genererats visas den direkt i appen och användaren kan:

- **Spara bilden** till sitt Yobbler-space för framtida användning.
- **Ladda ner** bilden i hög kvalitet.
- **Dela** bilden direkt via en länk om de önskar.

## **Olika Stadier av Användarupplevelsen**

### **1. Initial Sökning**

- Användaren skriver sin beskrivning och får omedelbara sökresultat från Pexels baserat på en AI-förbättrad sökterm.

### **2. Förbättring eller Bildgenerering**

- Om resultatet är tillfredsställande kan användaren spara eller ladda ner bilder.
- Om inga relevanta bilder finns, erbjuds användaren att skapa en egen AI-genererad bild genom ett stilval.

### **3. Bildhantering och Dela**

- Efter att en bild har genererats eller valts kan den sparas, bokmärkas, eller delas vidare för andra användningsområden. Integrationen med Yobbler gör det lätt för användaren att hålla ordning på sina favoriter.

## **Teknisk Arkitektur**

- **Frontend**: Byggs med **React 19** och **Tailwind CSS** för snabb, responsiv och snygg design. **Shadcn** används för att skapa en smidig och modern UX/UI.
- **Backend**: Integreras med **Pexels API** för bildsökning och **OpenAI API** för att förbättra söktermer och parametrar.
- **Bildgenerering**: Bildgenereringen kommer att vara ett senare tillägg, där AI (t.ex. DALL-E) genererar bilder baserade på användarens valda stil.

## **Framtida Funktionalitet**

- **Fler Bildbank-Integrationer**: Integrera fler bildbanker som Unsplash för att öka utbudet av bilder.
- **Utökade AI-funktioner**: Låt AI föreslå stilar baserat på inmatning, vilket automatiserar processen ytterligare.
- **Personliga Rekommendationer**: Baserat på tidigare sökningar och val kan AI rekommendera bilder eller stilar direkt till användaren.

Med denna app hoppas vi kunna göra det enklare för användare att hitta, skapa och hantera relevanta bilder för sina behov. Funktionen med AI-baserad bildgenerering kommer att ge ytterligare flexibilitet för situationer där standardbilder inte räcker till.

