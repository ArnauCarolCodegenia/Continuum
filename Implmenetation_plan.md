Frontend Modifications — Round 3
5 UI changes: remove Community Hub references, clean up Agent Builder, add chat navigation, and rebrand welcome banner.

Proposed Changes
1. Remove "Visitar el Centro de la Comunidad" from Checklist
[MODIFY] 
constants.js
Delete the visit_community checklist item (lines 157–167) — removes the last item from the PRIMEROS PASOS checklist
2. Clean up Agent Builder header
[MODIFY] 
HeaderMenu/index.jsx
Remove logo: Delete the <img> tag importing AnythingInfinityLogo (lines 2, 56–60)
Remove Publish button: Delete the Publish <button> (lines 125–130)
3. Remove Community Hub from Settings Sidebar
[MODIFY] 
SettingsSidebar/index.jsx
Remove the entire Community Hub <Option> block (lines 304–327) with its 3 child options (Explore Trending, Your Account, Import Item)
4. Add back-to-home arrow in chat view
[MODIFY] 
ChatContainer/index.jsx
Add a fixed arrow button in the top-right corner that navigates to paths.home()
Uses ArrowLeft icon from @phosphor-icons/react and React Router's useNavigate
Only rendered on desktop (not mobile, which already has 
SidebarMobileHeader
)
5. Translate & rebrand welcome banner
[MODIFY] 
Home/index.jsx
Change title from "Welcome to your LLM Assistant" → "Bienvenido a Questiona"
Translate description to Spanish
Verification Plan
Rebuild Docker containers with docker-compose up -d --build
Verify each change visually in the browser at http://localhost:3001