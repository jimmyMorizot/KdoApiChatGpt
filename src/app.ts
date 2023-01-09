const form = document.querySelector<HTMLFormElement>("form")!;
const ageInput = document.querySelector<HTMLInputElement>("#age")!;
const themesInput = document.querySelector<HTMLInputElement>("#themes")!;
const submitButton = document.querySelector<HTMLButtonElement>("button")!;
const footer = document.querySelector<HTMLElement>("footer")!;

/**
 * Transformer 35 et "Légos, jeux vidéos"
 * en
 * "Propose moi 5 idées de cadeaux pour une personne âgée de 35 ans et qui aime Légos, jeux vidéos !"
 */
const generatePromptByAgeAndThemes = (age: number, themes = "") => {
    let prompt = `Propose moi, avec un ton joyeux et amical, 5 idées de cadeau pour une personne âgée de ${age} ans`;

    if (themes.trim()) {
        prompt += ` et qui aime ${themes}`;
    }

    return prompt + " !";

};

/**
 * Mettre le bouton et le footer en mode "loading"
 */
const setLoadingItems = () => {
    footer.textContent = "Chargement de supers idées en cours !";
    footer.setAttribute("aria-busy", "true");
    submitButton.setAttribute("aria-busy", "true");
    submitButton.disabled = true;
}

/**
 * Enlever le mode "loading" du bouton et du footer
 */
const removeLoadingItems = () => {
    footer.setAttribute("aria-busy", "false");
    submitButton.setAttribute("aria-busy", "false");
    submitButton.disabled = false;
}

/**
 * Lancer tout le système lorsque le formulaire est soumis
 */
form.addEventListener("submit", (e: SubmitEvent) => {
    // Annuler le rechargement de la page
    e.preventDefault();

    // Mettre en mode "loading" le footer et le bouton
    setLoadingItems();
})

// Appeler l'API en lui passant la question
const OPENAI_API_KEY = "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";
fetch(`https://api.openai.com/v1/completions`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
        prompt: generatePromptByAgeAndThemes(
            ageInput.valueAsNumber,
            themesInput.value
        ),
        max_tokens: 2000,
        model: "text-davinci-003",
    }),
})
.then((response) => response.json())
.then((data) => {
    // Changer le HTML à l'intérieur du footer
    footer.innerHTML = translateTextToHtml(data.choices[0].text);
})
.finally(() => {
    // Supprimer le mode "loading" du footer et du bouton
    removeLoadingItems();
});

/**
 * Transformer
 * "Hello\nComment allez vous ?"
 * en
 * "<p>Hello</p><p>Comment allez vous?</p>"
 */
const translateTextToHtml = (text: string) => text
    .split("\n")
    .map((str) => `<p>${str}</p>`)
    .join("");
