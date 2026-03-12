// Assuming the rest of the file remains unchanged and we are only updating the rendering logic:

// Render the question explanation based on the selected language
let explanation = lang === 'ar' ? q.explanationAr : q.explanation;
if (explanation) {
    return (<div>{explanation}</div>);
}
