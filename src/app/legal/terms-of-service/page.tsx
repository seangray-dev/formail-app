import Link from "next/link";
import React from "react";

export default function TermsAndConditionsPage() {
  return (
    <section className="prose prose-invert">
      <div>
        <h1>Formail Terms of Service</h1>
        <p>
          By accessing, browsing, or otherwise using Formail ("Service"), you
          are agreeing to be bound by the following terms and conditions
          ("Terms"). Your access to and use of the Service is conditioned on
          your acceptance of and compliance with these Terms.
        </p>
      </div>

      <div>
        <h2>Account Terms</h2>
        <ul>
          <li>
            You are responsible for maintaining the security of your account and
            authentication credentials. Do not share your account credentials or
            give others access to your account. The Service cannot and will not
            be liable for any loss or damage from your failure to comply with
            this security obligation.
          </li>
          <li>
            You are responsible for all content posted and activity that occurs
            under your account (even content posted by others from any site
            linking to the Service).
          </li>
          <li>
            You may not use the Service for any illegal purpose or to violate
            any laws in your jurisdiction (including but not limited to
            copyright laws).
          </li>
          <li>
            You must provide us information that is accurate and complete when
            you create your account, you are required to keep your account
            information up to date.
          </li>
          <li>
            You may not use as a username the name of another person or entity
            or that is not lawfully available for use, a name or trademark that
            is subject to any rights of another person or entity other than you
            without appropriate authorization, or a name that is otherwise
            offensive, vulgar or obscene.
          </li>
          <li>
            You must be a human. Accounts registered by "bots" or other
            automated methods are not permitted.
          </li>
        </ul>
      </div>

      <div>
        <h2>Cancellation and Termination</h2>
        <ul>
          <li>
            You are solely responsible for properly canceling your account.
            Please {""}
            <Link
              href={"/contact"}
              className="font-light hover:text-primary hover:underline"
            >
              contact us
            </Link>{" "}
            to request cancellation. Your account is not considered cancelled
            until you receive a confirmation email from the Service.
          </li>
          <li>
            All of your content will be inaccessible from the Service
            immediately upon cancellation. Within 30 days, all data may be
            permanently deleted from all backups and logs. Information can not
            be recovered once it has been permanently deleted.
          </li>
          <li>
            The Service, in its sole discretion, has the right to suspend or
            terminate your account and refuse any and all current or future use
            of the Service for any reason at any time. Such termination of the
            Service will result in the deactivation or deletion of your account
            or your access to your account, and the forfeiture and
            relinquishment of all content in your account. The Service reserves
            the right to refuse service to anyone for any reason at any time.
          </li>
        </ul>
      </div>

      <div>
        <h2>Modification to the Service</h2>
        <ul>
          <li>
            The Service reserves the right at any time and from time to time to
            modify or discontinue, temporarily or permanently, any part of the
            Service with or without notice.
          </li>
          <li>
            The Service shall not be liable to you or to any third party for any
            modification, price change, suspension or discontinuance of the
            Service.
          </li>
        </ul>
      </div>

      <div>
        <h2>Payment Terms</h2>
        <ul>
          <li>
            Any plan fee change will become effective at the end of the
            then-current billing cycle.
          </li>
          <li>
            Any plan downgrade will become effective at the end of the
            then-current billing cycle.
          </li>
          <li>
            There will be no prorating for downgrades in-between billing cycles.
          </li>
          <li>
            Downgrading your Service may cause the loss of features or capacity
            of your account. The Service does not accept any liability for such
            loss.
          </li>
          <li>
            We reserve the right to change prices and fees at any time without
            informing you.
          </li>
          <li>Refunds are only issued if required by law.</li>
        </ul>
      </div>

      <div>
        <h2>Limitation of Liability</h2>
        <p>
          In no event shall Formspark, nor its proprietors, directors,
          shareholders, employees, partners, agents, suppliers, or affiliates,
          be liable for any indirect, incidental, special, consequential or
          punitive damages, including without limitation, loss of profits, data,
          use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul>
          <li>
            Your access to or use of or inability to access or use the Service.
          </li>
          <li>Any conduct or content of any third party on the Service.</li>
          <li>Any content obtained from the Service.</li>
          <li>
            Unauthorized access, use or alteration of your transmissions or
            content.
          </li>
        </ul>
      </div>

      <div>
        <h2>Disclaimer</h2>
        <p>Your use of the Service is at your sole risk.</p>
        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis.</p>
        <p>
          The Service is provided without warranties of any kind, whether
          express or implied, including, but not limited to, implied warranties
          of merchantability, fitness for a particular purpose, non-infringement
          or course of performance.
        </p>
        <p>We do not warrant that:</p>
        <ul>
          <li>
            The Service will function uninterrupted, secure or available at any
            particular time or location.
          </li>
          <li>Any errors or defects will be corrected.</li>
          <li>The results of using the Service will meet your requirements.</li>
        </ul>
      </div>

      <div>
        <h2>Accuracy of Materials</h2>
        <p>
          The materials appearing on the Service's website and any other
          communication formats could include technical, typographical, or
          photographic errors.
        </p>
        <p>
          The Service does not warrant that any of these materials are accurate,
          complete or current.
        </p>
        <p>
          The Service may make changes to these materials at any time without
          notice. However, the Service does not make any commitment to update
          these materials.
        </p>
      </div>

      <div>
        <h2>Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of Canada, without regard to its conflict of law provisions. The
          place of jurisdiction shall be exclusively in Canada.
        </p>
        <p>
          Our failure to enforce any right or provision of these Terms will not
          be considered a waiver of those rights.
        </p>
        <p>
          If any provision of these Terms is held to be invalid or unenforceable
          by a court, the remaining provisions of these Terms will remain in
          effect.
        </p>
        <p>
          These Terms constitute the entire agreement between us regarding our
          Service, and supersede and replace any prior agreements we might have
          between us regarding the Service.
        </p>
      </div>

      <div>
        <h2>Dispute Resolution</h2>
        <ul>
          <li>These Terms are subject the laws of Canada.</li>
          Parties will only appeal
          <li>
            to the courts after they have made every effort to settle a dispute
            in mutual consultation or mediation. In the case of mediation, the
            mediator muse be approved by both parties.
          </li>
          <li>
            Disputes will only be settled in Canada, unless otherwise required
            by law.
          </li>
          <li>
            Contrary to the legal limitation periods, the limitation period of
            all claims and defences against the Service and third parties
            involved is 12 months.
          </li>
        </ul>
      </div>

      <div>
        <h2>Changes to these Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to update, change or
          replace any part of these Terms by posting updates and changes to our
          website without informing you.
        </p>
        <p>
          Changes to these Terms are effective when they are posted on this
          page. It is your responsibility to check our website periodically for
          changes.
        </p>
        <p>
          Your continued use of or access to Service following the posting of
          any changes to these Terms constitutes acceptance of those changes.
        </p>
      </div>

      <div>
        <h2>Questions</h2>
        <p>Have any questions, comments, conerns about these Terms?</p>
        <p>
          Please get in touch with us by contacting us{" "}
          <Link href={"/contact"}>here</Link>.
        </p>
      </div>
    </section>
  );
}
