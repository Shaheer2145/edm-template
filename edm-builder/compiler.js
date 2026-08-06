// Compiler to convert the email builder JSON State into email-client friendly HTML tables and CSS

// no change to jsx
const EmailCompiler = {
  // Social Icon asset mapping
  socialIcons: {
    youtube: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/d004bed8-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973304942786",
    snapchat: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/cf04bed8-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973304942786",
    facebook: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/ad7204e5-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973437133456",
    telegram: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/e504bed8-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973317130590",
    twitter: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/cd04bed8-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973304942786",
    linkedin: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/b17204e5-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973437133456",
    tiktok: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/cc04bed8-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973304942786",
    instagram: "https://assets-eur.mkt.dynamics.com/0118406e-09e6-ee11-9048-000d3a688753/digitalassets/images/b07204e5-a3ac-ef11-b8e9-000d3a67a92a?ts=638682973439946011"
  },

  compile(state) {
    const settings = state.settings;
    const containerWidth = settings.width || 660;
    const direction = settings.direction || 'ltr';
    const dirAttr = `dir="${direction}"`;

    if (state.importedRawHTML) {
      return `<!DOCTYPE html>
<html lang="en" ${dirAttr}>
<head>
  <title>Email Template</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    body { margin:0; padding:0; width:100% !important; background-color:${settings.backgroundColor || '#f4f4f4'}; }
    table { border-collapse: collapse; }
    img { border:0; display:block; outline:none; text-decoration:none; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${settings.backgroundColor || '#f4f4f4'};" ${dirAttr}>
  <center style="width:100%; background-color:${settings.backgroundColor || '#f4f4f4'};">
    ${state.importedRawHTML}
  </center>
</body>
</html>`;
    }

    // Inject Custom Fonts stylesheet links from global settings
    let customFontLinks = '';
    if (settings.customFonts && settings.customFonts.length > 0) {
      settings.customFonts.forEach(font => {
        customFontLinks += `\n  <link href="${font.url}" rel="stylesheet" />`;
      });
    }

    // 1. Generate HTML Head and Styles
    let html = `<!DOCTYPE html>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
<head>
  <title>Email Template</title>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">${customFontLinks}
  <style type="text/css">
    /* Reset styles */
    body {
      margin: 0px !important;
      padding: 0px !important;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    
    /* Responsive Media Queries */
    @media only screen and (max-width: ${containerWidth}px) {
      table.container {
        width: 100% !important;
      }
      td.banner img {
        width: 100% !important;
        height: auto !important;
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .gutter {
        width: 20px !important;
      }
    }
    
    @media only screen and (max-width: 480px) {
      .mobile table,
      .mobile tbody,
      .mobile tr,
      .mobile td {
        display: block;
        width: 100% !important;
      }
      td.mobileheight {
        height: 10px !important;
      }
      td.gutter {
        width: 15px !important;
      }
    }
  </style>
</head>
<body style="margin:0px; padding:0px; font-family:${settings.fontFamily || 'Arial, sans-serif'};">
  <center>
    <!-- Outer wrapping table - Exposes direction RTL/LTR to top level table for Outlook copying -->
    <table ${dirAttr} align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width:100%;" width="100%">
      <tbody>
        <tr>
          <td align="center">
            <!-- Main Content Container Table -->
            <table ${dirAttr} align="center" border="0" cellpadding="0" cellspacing="0" class="container" style="width:${containerWidth}px; border-collapse: collapse; background-color:${settings.bodyBackgroundColor || '#ffffff'}; margin: 0px;" width="${containerWidth}">
              <tbody>`;

    // 2. Loop through sections and compile layouts
    state.sections.forEach(section => {
      // If padding columns/gutters are present
      const innerWidth = containerWidth - (section.settings.paddingLeft || 0) - (section.settings.paddingRight || 0);

      html += `
                <!-- Section Start -->
                <tr>
                  <td align="center" valign="top" style="background-color:${section.settings.backgroundColor || '#ffffff'};">
                    <!-- Section Wrapper Table containing Table Spacers and Gutters (Outlook-safe) -->
                    <table ${dirAttr} border="0" cellpadding="0" cellspacing="0" style="width:100%; border-collapse: collapse; background-color:${section.settings.backgroundColor || '#ffffff'};" width="100%">
                      <tbody>
                        <!-- Top Spacer -->
                        ${section.settings.paddingTop > 0 ? `
                        <tr>
                          <td height="${section.settings.paddingTop}" style="font-size:1px; line-height:1px; height:${section.settings.paddingTop}px;" colspan="3">&nbsp;</td>
                        </tr>` : ''}
                        
                        <!-- Content Row -->
                        <tr>
                          <!-- Left Gutter Spacer -->
                          ${section.settings.paddingLeft > 0 ? `
                          <td width="${section.settings.paddingLeft}" class="gutter" style="width:${section.settings.paddingLeft}px; font-size:1px; line-height:1px;">&nbsp;</td>` : ''}
                          
                          <!-- Content Columns Cell -->
                          <td align="center" valign="top">
                            <table ${dirAttr} border="0" cellpadding="0" cellspacing="0" style="width:100%; border-collapse: collapse;" width="100%" class="mobile">
                              <tbody>
                                <tr>`;

      // Compile columns
      section.columns.forEach(col => {
        const colWidthPercent = col.width || 100;
        const colWidthPx = Math.round((innerWidth * colWidthPercent) / 100);

        html += `
                                  <!-- Column -->
                                  <td width="${colWidthPx}" valign="top" class="mobile-stack" style="width:${colWidthPx}px; font-family:${settings.fontFamily || 'Arial, sans-serif'};">`;

        // Loop through elements inside this column
        col.elements.forEach(element => {
          html += this.compileElement(element, settings);
        });

        html += `
                                  </td>`;
      });

      html += `
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          
                          <!-- Right Gutter Spacer -->
                          ${section.settings.paddingRight > 0 ? `
                          <td width="${section.settings.paddingRight}" class="gutter" style="width:${section.settings.paddingRight}px; font-size:1px; line-height:1px;">&nbsp;</td>` : ''}
                        </tr>
                        
                        <!-- Bottom Spacer -->
                        ${section.settings.paddingBottom > 0 ? `
                        <tr>
                          <td height="${section.settings.paddingBottom}" style="font-size:1px; line-height:1px; height:${section.settings.paddingBottom}px;" colspan="3">&nbsp;</td>
                        </tr>` : ''}
                      </tbody>
                    </table>
                  </td>
                </tr>
                <!-- Section End -->`;
    });

    // 3. Close container and wrap tags
    html += `
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </center>
</body>
</html>`;

    return html;
  },

  // Compile individual elements into inline HTML markup
  compileElement(element, globalSettings) {
    const type = element.type;
    const styles = element.styles || {};
    const content = element.content || {};
    const font = styles.fontFamily || globalSettings.fontFamily || 'Arial, sans-serif';
    const direction = globalSettings.direction || 'ltr';
    const dirAttr = `dir="${direction}"`;

    let elHtml = '';

    // Alignment and text direction helpers
    const defaultAlign = direction === 'rtl' ? 'right' : 'left';
    const textAlign = styles.textAlign || defaultAlign;

    // Advanced Text styling builders
    const fontStyle = styles.fontStyle ? `font-style:${styles.fontStyle};` : '';
    const transformStyle = styles.textTransform ? `text-transform:${styles.textTransform};` : '';
    const letterSpacing = styles.letterSpacing ? `letter-spacing:${styles.letterSpacing}px;` : '';
    const textBgColor = styles.backgroundColor ? `background-color:${styles.backgroundColor};` : '';

    // Border helper style builders
    let borderStyle = '';
    if (styles.borderWidth && styles.borderColor) {
      borderStyle = `border:${styles.borderWidth}px ${styles.borderStyle || 'solid'} ${styles.borderColor};`;
    }

    switch (type) {
      case 'smart_html':
      case 'html_block':
      case 'raw_html':
        elHtml = content.html || content.text || '';
        break;

      case 'text':
        elHtml = `
                            <!-- Text Block -->
                            <table ${dirAttr} border="0" cellpadding="0" cellspacing="0" style="width:100%; border-collapse: collapse;" width="100%">
                              <tbody>
                                <!-- Element Top Spacer -->
                                ${styles.paddingTop > 0 ? `<tr><td height="${styles.paddingTop}" style="font-size:1px; line-height:1px; height:${styles.paddingTop}px;">&nbsp;</td></tr>` : ''}
                                <tr>
                                  <!-- Element Left Gutter -->
                                  ${styles.paddingLeft > 0 ? `<td width="${styles.paddingLeft}" style="width:${styles.paddingLeft}px; font-size:1px; line-height:1px;">&nbsp;</td>` : ''}
                                  
                                  <td align="${textAlign}" style="font-family:${font}; font-size:${styles.fontSize || 14}px; color:${styles.color || '#000000'}; line-height:${styles.lineHeight || 120}%; text-align:${textAlign}; direction:${direction}; font-weight:${styles.fontWeight || 'normal'}; ${fontStyle} ${transformStyle} ${letterSpacing} ${textBgColor}" valign="top">
                                    ${content.text || ''}
                                  </td>
                                  
                                  <!-- Element Right Gutter -->
                                  ${styles.paddingRight > 0 ? `<td width="${styles.paddingRight}" style="width:${styles.paddingRight}px; font-size:1px; line-height:1px;">&nbsp;</td>` : ''}
                                </tr>
                                <!-- Element Bottom Spacer -->
                                ${styles.paddingBottom > 0 ? `<tr><td height="${styles.paddingBottom}" style="font-size:1px; line-height:1px; height:${styles.paddingBottom}px;">&nbsp;</td></tr>` : ''}
                              </tbody>
                            </table>`;
        break;

      case 'image':
        let imgRadius = styles.borderRadius ? `border-radius:${styles.borderRadius}px;` : '';
        elHtml = `
                  <!-- Image Block -->
                    <table ${dirAttr} align="${styles.alignment || 'center'}" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width:100%;" width="100%">
                      <tbody>
                                                    <!-- Element Top Spacer -->
                                ${styles.paddingTop > 0 ? `<tr><td height="${styles.paddingTop}" style="font-size:1px; line-height:1px; height:${styles.paddingTop}px;" colspan="3">&nbsp;</td></tr>` : ''}
                                <tr>
                                  <!-- Element Left Gutter -->
                                  ${styles.paddingLeft > 0 ? `<td width="${styles.paddingLeft}" style="width:${styles.paddingLeft}px; font-size:1px; line-height:1px;">&nbsp;</td>` : ''}
                                  
                                  <td align="${styles.alignment || 'center'}">
                                    ${content.href ? `<a href="${content.href}" target="_blank">` : ''}
                                    <img src="${content.src || 'https://via.placeholder.com/600x200'}" alt="${content.alt || 'Image'}" width="${styles.width || 600}" style="display:block; border:0; outline:none; width:${styles.width || 600}px; max-width:100%; height:auto; ${borderStyle} ${imgRadius}" />
                                    ${content.href ? `</a>` : ''}
                                  </td>
                                  
                                  <!-- Element Right Gutter -->
                                  ${styles.paddingRight > 0 ? `<td width="${styles.paddingRight}" style="width:${styles.paddingRight}px; font-size:1px; line-height:1px;">&nbsp;</td>` : ''}
                                </tr>
                                <!-- Element Bottom Spacer -->
                                ${styles.paddingBottom > 0 ? `<tr><td height="${styles.paddingBottom}" style="font-size:1px; line-height:1px; height:${styles.paddingBottom}px;" colspan="3">&nbsp;</td></tr>` : ''}
                              </tbody>
                            </table>`;
        break;

      case 'button':
        elHtml = `
                            <!-- Button Block -->
                            <table ${dirAttr} align="${styles.alignment || 'center'}" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width:100%;" width="100%">
                              <tbody>
                                <!-- Outer Top Spacer -->
                                ${styles.paddingTop > 0 ? `<tr><td height="${styles.paddingTop}" style="font-size:1px; line-height:1px; height:${styles.paddingTop}px;">&nbsp;</td></tr>` : ''}
                                <tr>
                                  <td align="${styles.alignment || 'center'}">
                                    <!-- Inner Button Table -->
                                    <table ${dirAttr} align="${styles.alignment || 'center'}" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                      <tbody>
                                        <tr>
                                          <!-- Button Cell Padding is safe inside cell -->
                                          <td align="center" bgcolor="${styles.backgroundColor || '#6366f1'}" style="border-radius:${styles.borderRadius || 4}px; background-color:${styles.backgroundColor || '#6366f1'}; padding-top:${styles.paddingTop || 12}px; padding-bottom:${styles.paddingBottom || 12}px; padding-left:${styles.paddingLeft || 24}px; padding-right:${styles.paddingRight || 24}px; ${borderStyle}">
                                            <a href="${content.href || '#'}" target="_blank" style="font-family:${font}; font-size:${styles.fontSize || 16}px; font-weight:${styles.fontWeight || 'bold'}; color:${styles.color || '#ffffff'}; text-decoration:none; display:block;">
                                              ${content.text || 'Click Here'}
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <!-- Outer Bottom Spacer -->
                                ${styles.paddingBottom > 0 ? `<tr><td height="${styles.paddingBottom}" style="font-size:1px; line-height:1px; height:${styles.paddingBottom}px;">&nbsp;</td></tr>` : ''}
                              </tbody>
                            </table>`;
        break;

      case 'spacer':
        elHtml = `
                            <!-- Spacer Block -->
                            <table ${dirAttr} border="0" cellpadding="0" cellspacing="0" style="width:100%; border-collapse: collapse;" width="100%">
                              <tbody>
                                <tr>
                                  <td height="${styles.height || 20}" style="font-size:1px; line-height:1px; height:${styles.height || 20}px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>`;
        break;

      case 'divider':
        elHtml = `
                            <!-- Divider Block -->
                            <table ${dirAttr} border="0" cellpadding="0" cellspacing="0" style="width:100%; border-collapse: collapse;" width="100%">
                              <tbody>
                                <!-- Outer Top Spacer -->
                                ${styles.paddingTop > 0 ? `<tr><td height="${styles.paddingTop}" style="font-size:1px; line-height:1px; height:${styles.paddingTop}px;">&nbsp;</td></tr>` : ''}
                                <tr>
                                  <td style="border-top:${styles.borderWidth || 1}px ${styles.borderStyle || 'solid'} ${styles.borderColor || '#cccccc'}; font-size:1px; line-height:1px;">&nbsp;</td>
                                </tr>
                                <!-- Outer Bottom Spacer -->
                                ${styles.paddingBottom > 0 ? `<tr><td height="${styles.paddingBottom}" style="font-size:1px; line-height:1px; height:${styles.paddingBottom}px;">&nbsp;</td></tr>` : ''}
                              </tbody>
                            </table>`;
        break;

      case 'social':
        elHtml = `
                            <!-- Social Block -->
                            <table ${dirAttr} align="${styles.alignment || 'center'}" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width:100%;" width="100%">
                              <tbody>
                                <!-- Outer Top Spacer -->
                                ${styles.paddingTop > 0 ? `<tr><td height="${styles.paddingTop}" style="font-size:1px; line-height:1px; height:${styles.paddingTop}px;">&nbsp;</td></tr>` : ''}
                                <tr>
                                  <td align="${styles.alignment || 'center'}">
                                    <table ${dirAttr} align="${styles.alignment || 'center'}" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                      <tbody>
                                        <tr>`;

        let hasSocials = false;
        Object.keys(content).forEach((key, index, arr) => {
          const url = content[key];
          if (url && this.socialIcons[key]) {
            hasSocials = true;
            elHtml += `
                                          <td align="center" style="text-align:center;">
                                            <a href="${url}" target="_blank">
                                              <img align="center" src="${this.socialIcons[key]}" alt="${key}" width="${styles.iconSize || 40}" style="display:block; border:0; outline:none; width:${styles.iconSize || 40}px;" />
                                            </a>
                                          </td>`;

            // Add spacing between icons, except after the last icon
            if (index < arr.length - 1) {
              elHtml += `
                                          <td width="15">&nbsp;</td>`;
            }
          }
        });

        if (!hasSocials) {
          elHtml += `<td><span style="font-size:11px; color:#999; font-family:${font};">Social Icons Placeholder</span></td>`;
        }

        elHtml += `
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <!-- Outer Bottom Spacer -->
                                ${styles.paddingBottom > 0 ? `<tr><td height="${styles.paddingBottom}" style="font-size:1px; line-height:1px; height:${styles.paddingBottom}px;">&nbsp;</td></tr>` : ''}
                              </tbody>
                            </table>`;
        break;

      case 'membership':
        elHtml = `
                            <!-- Membership Block -->
                            <table ${dirAttr} align="${textAlign}" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width:100%;" width="100%">
                              <tbody>
                                <!-- Outer Top Spacer -->
                                ${styles.paddingTop > 0 ? `<tr><td height="${styles.paddingTop}" style="font-size:1px; line-height:1px; height:${styles.paddingTop}px;">&nbsp;</td></tr>` : ''}
                                <tr>
                                  <td style="font-family:${font}; font-size:${styles.fontSize || 10}px; color:${styles.color || '#000000'}; line-height:${styles.lineHeight || 110}%; text-align:${textAlign}; direction:${direction};">
                                    <span style="display:block; margin:0px; ${fontStyle} ${transformStyle} ${letterSpacing}">${content.label || 'Membership Number:'}</span>
                                    <span style="display:block; margin:0px; font-weight:bold; ${fontStyle} ${transformStyle} ${letterSpacing}"><span class="msdynmkt_personalization">${content.tag || '{{AlfursanMembershipID}}'}</span></span>
                                  </td>
                                </tr>
                                <!-- Outer Bottom Spacer -->
                                ${styles.paddingBottom > 0 ? `<tr><td height="${styles.paddingBottom}" style="font-size:1px; line-height:1px; height:${styles.paddingBottom}px;">&nbsp;</td></tr>` : ''}
                              </tbody>
                            </table>`;
        break;

      default:
        elHtml = `<!-- Unsupported Block Type: ${type} -->`;
        break;
    }

    return elHtml;
  }
};
