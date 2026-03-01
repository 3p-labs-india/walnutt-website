import { LegalLayout, legalStyles as s } from "./legal-layout";
import { C } from "./shared";

export function TermsConditions() {
  return (
    <LegalLayout>
      <div style={s.badge}>Legal</div>
      <h1 style={s.pageTitle}>Terms & Conditions</h1>
      <p style={s.meta}>
        <strong style={s.strong}>Walnutt</strong><br />
        <strong style={s.strong}>Effective Date:</strong> 1 March 2026<br />
        <strong style={s.strong}>Last Updated:</strong> 28 February 2026
      </p>

      <p style={s.intro}>
        These Terms and Conditions ("Terms") govern your access to and use of the Walnutt platform, website (walnutt.co), and related services (collectively, the "Platform") operated by Walnutt ("we," "us," or "our").
      </p>
      <p style={s.p}>
        By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, do not use the Platform.
      </p>

      <hr style={s.divider} />

      {/* 1 */}
      <h2 style={s.h2}>1. Definitions</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>"Candidate"</strong> refers to any individual who creates an account to take assessments, build a skill profile, or use learning features on the Platform.</li>
        <li style={s.li}><strong style={s.strong}>"Company"</strong> refers to any business or individual that uses the Platform to post roles, review candidate profiles, or hire engineers.</li>
        <li style={s.li}><strong style={s.strong}>"User"</strong> refers to any Candidate or Company using the Platform.</li>
        <li style={s.li}><strong style={s.strong}>"AI Services"</strong> refers to Walnutt's artificial intelligence and machine learning features, including adaptive assessments, AI-powered interviews, AI mentor, and candidate-company matching.</li>
        <li style={s.li}><strong style={s.strong}>"Profile"</strong> refers to the verified skill profile generated for a Candidate on the Platform, including assessment scores, dimension breakdowns, and linked portfolio information.</li>
        <li style={s.li}><strong style={s.strong}>"Content"</strong> refers to any text, data, files, information, or materials uploaded, submitted, or generated through the Platform.</li>
      </ul>

      <hr style={s.divider} />

      {/* 2 */}
      <h2 style={s.h2}>2. Eligibility</h2>
      <ul style={s.ul}>
        <li style={s.li}>You must be at least 18 years of age to use the Platform.</li>
        <li style={s.li}>If you are using the Platform on behalf of a company or organisation, you represent that you have the authority to bind that entity to these Terms.</li>
        <li style={s.li}>You must provide accurate and complete information when creating an account.</li>
      </ul>

      <hr style={s.divider} />

      {/* 3 */}
      <h2 style={s.h2}>3. Account Registration and Security</h2>
      <ul style={s.ul}>
        <li style={s.li}>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li style={s.li}>You are responsible for all activity that occurs under your account.</li>
        <li style={s.li}>You must notify us immediately at <a href="mailto:hello@walnutt.co" style={s.email}>hello@walnutt.co</a> if you suspect any unauthorised access to your account.</li>
        <li style={s.li}>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
      </ul>

      <hr style={s.divider} />

      {/* 4 */}
      <h2 style={s.h2}>4. Platform Services</h2>

      <h3 style={s.h3}>4.1 For Candidates</h3>
      <p style={s.p}>The Platform provides:</p>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>AI-powered adaptive assessments</strong> that evaluate your engineering skills across multiple dimensions, personalised to your target role and experience level</li>
        <li style={s.li}><strong style={s.strong}>AI mentor</strong> that provides personalised learning paths, resource recommendations, and skill-building guidance based on your assessment results</li>
        <li style={s.li}><strong style={s.strong}>Verified skill profiles</strong> that display your readiness score, dimension breakdowns, and linked portfolio for companies to review</li>
        <li style={s.li}><strong style={s.strong}>Opportunity matching</strong> where companies can discover your profile based on AI-generated compatibility scores</li>
      </ul>

      <h3 style={s.h3}>4.2 For Companies</h3>
      <p style={s.p}>The Platform provides:</p>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Role posting</strong> where you describe your ideal hire or submit a job description</li>
        <li style={s.li}><strong style={s.strong}>AI-extracted requirements</strong> where our AI analyses your JD to identify required skills and experience</li>
        <li style={s.li}><strong style={s.strong}>Verified candidate profiles</strong> with assessment scores, dimension breakdowns, and match percentages</li>
        <li style={s.li}><strong style={s.strong}>AI-powered interviews</strong> where our AI conducts structured technical interviews calibrated to your role requirements and delivers evaluation scorecards</li>
        <li style={s.li}><strong style={s.strong}>Candidate matching</strong> ranked by fit against your requirements</li>
      </ul>

      <h3 style={s.h3}>4.3 About AI Services</h3>
      <ul style={s.ul}>
        <li style={s.li}>AI Services are provided to assist and augment decision-making, not to replace human judgment. Companies are responsible for making their own final hiring decisions.</li>
        <li style={s.li}>AI-generated scores, evaluations, and recommendations are based on the data available to the Platform at the time of processing. They are not guarantees of ability, performance, or suitability.</li>
        <li style={s.li}>We continuously work to improve the accuracy and fairness of our AI. However, like all AI systems, our models may produce imperfect results. Users should treat AI outputs as one input among many in their decision-making.</li>
        <li style={s.li}>We do not guarantee any specific outcomes, including but not limited to job placement, hiring success, or skill improvement.</li>
      </ul>

      <hr style={s.divider} />

      {/* 5 */}
      <h2 style={s.h2}>5. Fees and Payments</h2>

      <h3 style={s.h3}>5.1 For Candidates</h3>
      <ul style={s.ul}>
        <li style={s.li}>The first assessment is free.</li>
        <li style={s.li}>Additional services or premium features may be offered at a cost. Pricing will be clearly communicated before any charges apply.</li>
      </ul>

      <h3 style={s.h3}>5.2 For Companies</h3>
      <ul style={s.ul}>
        <li style={s.li}>Walnutt charges a success-based fee of <strong style={s.strong}>8–10% of the hired candidate's annual CTC</strong> (Cost to Company), payable upon successful hire through the Platform.</li>
        <li style={s.li}>A "successful hire" means a candidate sourced or matched through the Walnutt Platform who accepts an offer of employment from the Company.</li>
        <li style={s.li}>Payment terms, invoicing, and any additional fees will be specified in a separate agreement or order form between Walnutt and the Company.</li>
        <li style={s.li}>If a hired candidate leaves the Company within 90 days of joining for reasons not attributable to the Company, Walnutt will provide one replacement search at no additional fee, subject to availability.</li>
      </ul>

      <h3 style={s.h3}>5.3 General</h3>
      <ul style={s.ul}>
        <li style={s.li}>All fees are exclusive of applicable taxes (including GST) unless stated otherwise.</li>
        <li style={s.li}>Walnutt reserves the right to modify pricing with 30 days' prior notice. Changes will not affect ongoing active engagements.</li>
      </ul>

      <hr style={s.divider} />

      {/* 6 */}
      <h2 style={s.h2}>6. User Conduct</h2>
      <p style={s.p}>You agree not to:</p>
      <ul style={s.ul}>
        <li style={s.li}>Provide false, misleading, or inaccurate information on your profile or assessments</li>
        <li style={s.li}>Use automated tools, bots, or scripts to access the Platform or complete assessments</li>
        <li style={s.li}>Attempt to manipulate, reverse-engineer, or game the assessment or matching algorithms</li>
        <li style={s.li}>Share your account credentials with others or allow others to take assessments on your behalf</li>
        <li style={s.li}>Use the Platform to harass, discriminate against, or harm other users</li>
        <li style={s.li}>Scrape, copy, or extract data from the Platform without written permission</li>
        <li style={s.li}>Use candidate information obtained through the Platform for any purpose other than evaluating candidates for employment at your organisation</li>
        <li style={s.li}>Contact candidates outside the Platform to circumvent Walnutt's matching and fee structure</li>
        <li style={s.li}>Upload content that is illegal, infringing, defamatory, or harmful</li>
      </ul>
      <p style={s.p}>Violation of these rules may result in immediate account suspension or termination.</p>

      <hr style={s.divider} />

      {/* 7 */}
      <h2 style={s.h2}>7. Intellectual Property</h2>

      <h3 style={s.h3}>7.1 Walnutt's IP</h3>
      <p style={s.p}>The Platform, including its design, code, AI models, assessment content, algorithms, branding, and all associated intellectual property, is owned by Walnutt. You may not copy, modify, distribute, sell, or create derivative works from any part of the Platform without our prior written consent.</p>

      <h3 style={s.h3}>7.2 Your Content</h3>
      <ul style={s.ul}>
        <li style={s.li}>You retain ownership of the content you upload to the Platform (resume, GitHub links, JDs, etc.).</li>
        <li style={s.li}>By uploading content, you grant Walnutt a non-exclusive, worldwide, royalty-free licence to use, process, display, and store that content for the purpose of providing Platform services.</li>
        <li style={s.li}>For Candidates: You grant Walnutt permission to display your Profile information (scores, dimensions, linked portfolios) to Companies on the Platform.</li>
        <li style={s.li}>This licence ends when you delete your account and your data is removed in accordance with our Privacy Policy.</li>
      </ul>

      <h3 style={s.h3}>7.3 Assessment Content</h3>
      <ul style={s.ul}>
        <li style={s.li}>Assessment questions, evaluation criteria, and scoring methodologies are proprietary to Walnutt.</li>
        <li style={s.li}>You may not reproduce, share, screenshot, or distribute assessment content in any form.</li>
      </ul>

      <hr style={s.divider} />

      {/* 8 */}
      <h2 style={s.h2}>8. Confidentiality</h2>

      <h3 style={s.h3}>8.1 For Companies</h3>
      <ul style={s.ul}>
        <li style={s.li}>Candidate information accessed through the Platform is confidential. You may not share, disclose, or distribute candidate profiles, scores, or evaluations to third parties without the candidate's explicit consent.</li>
        <li style={s.li}>Candidate information may only be used for the purpose of evaluating candidates for employment at your organisation.</li>
      </ul>

      <h3 style={s.h3}>8.2 For Candidates</h3>
      <p style={s.p}>Job descriptions, company details, and hiring requirements shared through the Platform are confidential. You may not share or distribute this information outside the Platform.</p>

      <hr style={s.divider} />

      {/* 9 */}
      <h2 style={s.h2}>9. Disclaimers</h2>
      <ul style={s.ul}>
        <li style={s.li}>The Platform is provided on an "as is" and "as available" basis.</li>
        <li style={s.li}>We do not warrant that the Platform will be uninterrupted, error-free, or completely secure.</li>
        <li style={s.li}>We do not guarantee the accuracy, reliability, or completeness of AI-generated assessments, scores, evaluations, or recommendations.</li>
        <li style={s.li}>We do not guarantee that Candidates will receive job offers or that Companies will find suitable candidates.</li>
        <li style={s.li}>Walnutt is not a party to any employment relationship between Candidates and Companies. We are a technology platform that facilitates connections.</li>
      </ul>

      <hr style={s.divider} />

      {/* 10 */}
      <h2 style={s.h2}>10. Limitation of Liability</h2>
      <p style={s.p}>To the maximum extent permitted by applicable law:</p>
      <ul style={s.ul}>
        <li style={s.li}>Walnutt's total liability for any claim arising out of or relating to these Terms or your use of the Platform shall not exceed the amount you paid to Walnutt in the 12 months preceding the claim, or INR 10,000, whichever is greater.</li>
        <li style={s.li}>Walnutt shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, revenue, data, or business opportunities.</li>
        <li style={s.li}>Walnutt shall not be liable for any decisions made by Companies or Candidates based on AI-generated scores, evaluations, or recommendations.</li>
      </ul>

      <hr style={s.divider} />

      {/* 11 */}
      <h2 style={s.h2}>11. Indemnification</h2>
      <p style={s.p}>You agree to indemnify and hold harmless Walnutt, its directors, officers, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising out of:</p>
      <ul style={s.ul}>
        <li style={s.li}>Your violation of these Terms</li>
        <li style={s.li}>Your use of the Platform</li>
        <li style={s.li}>Any content you submit to the Platform</li>
        <li style={s.li}>Any hiring decisions made based on information obtained through the Platform</li>
      </ul>

      <hr style={s.divider} />

      {/* 12 */}
      <h2 style={s.h2}>12. Termination</h2>
      <ul style={s.ul}>
        <li style={s.li}>You may terminate your account at any time by contacting <a href="mailto:hello@walnutt.co" style={s.email}>hello@walnutt.co</a> or through your account settings.</li>
        <li style={s.li}>We may suspend or terminate your account at any time if you violate these Terms, with or without prior notice.</li>
        <li style={s.li}>Upon termination, your right to use the Platform ceases immediately. Data deletion will follow the timeline described in our Privacy Policy.</li>
        <li style={s.li}>Provisions that by their nature should survive termination (including Sections 7, 8, 9, 10, 11, and 13) will continue to apply.</li>
      </ul>

      <hr style={s.divider} />

      {/* 13 */}
      <h2 style={s.h2}>13. Dispute Resolution</h2>
      <ul style={s.ul}>
        <li style={s.li}>These Terms are governed by the laws of India.</li>
        <li style={s.li}>Any dispute arising out of or in connection with these Terms shall first be attempted to be resolved through good-faith negotiation between the parties.</li>
        <li style={s.li}>If negotiation fails, the dispute shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be Bengaluru, India. The language of arbitration shall be English.</li>
        <li style={s.li}>The courts of Bengaluru, India shall have exclusive jurisdiction over any matters not subject to arbitration.</li>
      </ul>

      <hr style={s.divider} />

      {/* 14 */}
      <h2 style={s.h2}>14. Modifications</h2>
      <ul style={s.ul}>
        <li style={s.li}>We may update these Terms from time to time. When we make material changes, we will update the "Last Updated" date and notify you via email or through the Platform.</li>
        <li style={s.li}>Your continued use of the Platform after changes constitutes acceptance of the updated Terms.</li>
        <li style={s.li}>If you do not agree to the updated Terms, you should stop using the Platform and contact us to delete your account.</li>
      </ul>

      <hr style={s.divider} />

      {/* 15 */}
      <h2 style={s.h2}>15. General Provisions</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.</li>
        <li style={s.li}><strong style={s.strong}>Waiver:</strong> Our failure to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision.</li>
        <li style={s.li}><strong style={s.strong}>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and Walnutt regarding your use of the Platform.</li>
        <li style={s.li}><strong style={s.strong}>Assignment:</strong> You may not assign or transfer your rights under these Terms without our prior written consent. We may assign our rights without restriction.</li>
      </ul>

      <hr style={s.divider} />

      {/* 16 */}
      <h2 style={s.h2}>16. Contact Us</h2>
      <p style={s.p}>If you have questions about these Terms:</p>
      <div style={{
        padding: 20, borderRadius: 12, background: C.sageLight,
        border: `1px solid rgba(58,107,76,0.12)`,
      }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: C.black, margin: "0 0 4px" }}>Walnutt</p>
        <p style={{ fontSize: 14, color: C.gray800, margin: "0 0 2px" }}>Email: <a href="mailto:hello@walnutt.co" style={s.email}>hello@walnutt.co</a></p>
        <p style={{ fontSize: 14, color: C.gray800, margin: 0 }}>Website: www.walnutt.co</p>
      </div>

      <p style={{ ...s.p, marginTop: 32, fontStyle: "italic", color: C.gray500 }}>
        These Terms & Conditions are governed by the laws of India.
      </p>
    </LegalLayout>
  );
}
