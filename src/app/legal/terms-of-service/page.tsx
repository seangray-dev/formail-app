import Link from "next/link";
import React from "react";

export default function TermsAndConditionsPage() {
  return (
    <section className="prose prose-invert">
      <div>
        <h1>Formail Terms of Service</h1>
        <p>
          By accessing, browsing, or otherwise utilizing Formail
          (&quot;Service&quot;), you consent to be bound by the ensuing terms
          and conditions (&quot;Terms&quot;). Your access to and use of the
          Service is contingent upon your acceptance of and adherence to these
          Terms.
        </p>
      </div>

      <div>
        <h2>Account Terms</h2>
        <ul>
          <li>
            You bear the responsibility for securing your account and
            authentication credentials. Avoid sharing your account credentials
            or allowing others access to your account. The Service will not be
            held accountable for any loss or damage resulting from your
            non-compliance with this security obligation.
          </li>
          <li>
            You are accountable for all content posted and activity that
            transpires under your account (including content posted by others
            from any site linking to the Service).
          </li>
          <li>
            You are prohibited from using the Service for any illegal activities
            or to infringe any laws in your jurisdiction (including but not
            limited to copyright laws).
          </li>
          <li>
            You are obligated to provide us with accurate and complete
            information when you create your account, and to keep your account
            information current.
          </li>
          <li>
            You are prohibited from using as a username the name of another
            person or entity that is not lawfully available for use, a name or
            trademark that is subject to any rights of another person or entity
            other than you without appropriate authorization, or a name that is
            otherwise offensive, vulgar or obscene.
          </li>
          <li>
            You must be a human. Accounts registered by &quot;bots&quot; or
            other automated methods are not allowed.
          </li>
        </ul>
      </div>

      <div>
        <h2>Account Cancellation and Termination</h2>
        <ul>
          <li>
            You hold sole responsibility for correctly canceling your account.
            Please{" "}
            <Link
              href={"/contact"}
              className="font-light hover:text-primary hover:underline"
            >
              contact us
            </Link>{" "}
            to request cancellation. Your account is not deemed cancelled until
            you receive a confirmation email from the Service.
          </li>
          <li>
            All of your content will become inaccessible from the Service
            immediately upon cancellation. Within 30 days, all data may be
            permanently erased from all backups and logs. Information cannot be
            retrieved once it has been permanently deleted.
          </li>
          <li>
            The Service, at its sole discretion, reserves the right to suspend
            or terminate your account and deny any and all current or future use
            of the Service for any reason at any time. Such termination of the
            Service will lead to the deactivation or deletion of your account or
            your access to your account, and the forfeiture and relinquishment
            of all content in your account. The Service reserves the right to
            refuse service to anyone for any reason at any time.
          </li>
        </ul>
      </div>

      <div>
        <h2>Service Modifications</h2>
        <ul>
          <li>
            The Service retains the right at any moment and periodically to
            alter or cease, temporarily or permanently, any part of the Service
            with or without prior notice.
          </li>
          <li>
            The Service will not be held accountable to you or to any third
            party for any modification, price alteration, suspension or
            discontinuation of the Service.
          </li>
        </ul>
      </div>

      <div>
        <h2>Billing Terms</h2>
        <ul>
          <li>
            Any changes to plan fees will take effect at the end of the current
            billing cycle.
          </li>
          <li>
            Any plan downgrades will take effect at the end of the current
            billing cycle.
          </li>
          <li>
            There will be no prorating for downgrades that occur in the middle
            of billing cycles.
          </li>
          <li>
            Downgrading your Service may result in the loss of features or
            capacity of your account. The Service does not assume any liability
            for such loss.
          </li>
          <li>
            We reserve the right to alter prices and fees at any time without
            prior notice.
          </li>
          <li>Refunds are only provided if mandated by law.</li>
        </ul>
      </div>

      <div>
        <h2>Limitation of Liability</h2>
        <p>
          Under no circumstances shall Formail, nor its proprietors, directors,
          shareholders, employees, partners, agents, suppliers, or affiliates,
          be held accountable for any indirect, incidental, special,
          consequential or punitive damages, including but not limited to, loss
          of profits, data, use, goodwill, or other intangible losses, resulting
          from:
        </p>
        <ul>
          <li>Your ability or inability to access or use the Service.</li>
          <li>Any behavior or content of any third party on the Service.</li>
          <li>Any content procured from the Service.</li>
          <li>
            Unauthorized access, use or modification of your transmissions or
            content.
          </li>
        </ul>
      </div>

      <div>
        <h2>Disclaimer</h2>
        <p>Your utilization of the Service is at your sole risk.</p>
        <p>
          The Service is offered on an &quot;AS IS&quot; and &quot;AS
          AVAILABLE&quot; basis.
        </p>
        <p>
          The Service is provided without warranties of any kind, whether
          express or implied, including, but not limited to, implied warranties
          of merchantability, suitability for a specific purpose,
          non-infringement or course of performance.
        </p>
        <p>We do not warrant that:</p>
        <ul>
          <li>
            The Service will operate uninterrupted, secure or available at any
            specific time or location.
          </li>
          <li>Any errors or defects will be rectified.</li>
          <li>
            The outcomes of using the Service will meet your expectations.
          </li>
        </ul>
      </div>

      <div>
        <h2>Material Accuracy</h2>
        <p>
          The materials displayed on the Service&apos;s website and other
          communication formats may contain technical, typographical, or
          photographic errors.
        </p>
        <p>
          The Service does not guarantee that any of these materials are
          accurate, complete, or up-to-date.
        </p>
        <p>
          The Service may modify these materials at any time without prior
          notice. However, the Service does not commit to updating these
          materials.
        </p>
      </div>

      <div>
        <h2>Jurisdiction</h2>
        <p>
          These Terms are to be interpreted and applied in accordance with the
          laws of Canada, without consideration of its conflict of law
          provisions. The jurisdiction shall be exclusively in Canada.
        </p>
        <p>
          Our inability to enforce any right or provision of these Terms will
          not be deemed a waiver of those rights.
        </p>
        <p>
          If any provision of these Terms is found to be invalid or
          unenforceable by a court, the remaining provisions of these Terms will
          continue to be in effect.
        </p>
        <p>
          These Terms represent the complete agreement between us concerning our
          Service, and supersede and replace any previous agreements we might
          have had between us concerning the Service.
        </p>
      </div>

      <div>
        <h2>Resolution of Disputes</h2>
        <ul>
          <li>These Terms are governed by the laws of Canada.</li>
          <li>
            Parties will only resort to the courts after they have exhausted all
            efforts to resolve a dispute through mutual consultation or
            mediation. In the case of mediation, the mediator must be mutually
            agreed upon by both parties.
          </li>
          <li>
            Disputes will be resolved exclusively in Canada, unless otherwise
            mandated by law.
          </li>
          <li>
            Contrary to the legal limitation periods, the limitation period for
            all claims and defenses against the Service and third parties
            involved is 12 months.
          </li>
        </ul>
      </div>

      <div>
        <h2>Modifications to these Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify, alter or
          replace any part of these Terms by posting updates and changes to our
          website without notifying you.
        </p>
        <p>
          Modifications to these Terms become effective when they are posted on
          this page. It is your responsibility to periodically review our
          website for changes.
        </p>
        <p>
          Your continued use of or access to the Service following the posting
          of any changes to these Terms signifies your acceptance of those
          changes.
        </p>
      </div>

      <div>
        <h2>Questions</h2>
        <p>Have any questions, comments, or conerns about these Terms?</p>
        <p>
          Please get in touch with us by contacting us{" "}
          <Link href={"/contact"}>here</Link>.
        </p>
      </div>
    </section>
  );
}
