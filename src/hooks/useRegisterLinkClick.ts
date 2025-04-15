
export const registerLinkClick = async (linkId: string, profileId: string) => {
  try {
    // Store click in local storage for now
    const clicks = JSON.parse(localStorage.getItem('link_clicks') || '[]');
    clicks.push({
      link_id: linkId,
      profile_id: profileId,
      click_date: new Date().toISOString(),
    });
    localStorage.setItem('link_clicks', JSON.stringify(clicks));
    
    console.log("Link click registered locally:", linkId);
  } catch (error) {
    console.error("Erro ao registrar clique:", error);
  }
};
