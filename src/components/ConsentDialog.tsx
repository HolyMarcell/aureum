import React from 'react'
import { useApp } from '../context/AppContext'

export default function ConsentDialog() {
    const {state, acceptConsent} = useApp()

    if (state.consentAccepted) return null

    React.useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [])

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70" aria-hidden="true"/>

            {/* Dialog */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="legal-title"
                    className="w-full max-w-xl rounded-xl border border-gray-800 bg-gray-900/90 backdrop-blur p-5 text-gray-200 shadow-xl"
                >
                    <h2 id="legal-title" className="text-xl font-bold text-aureum-yellow">Allgemeine
                        Geschäftsbedingungen (AGB) </h2>
                    <div className="mt-3 max-h-72 overflow-auto pr-2 text-sm leading-6 text-gray-300">
                        <p className={'font-bold'}>1. Geltungsbereich</p>
                        <p className="mb-3">
                            Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der Software/Website [Name
                            der Software] (im Folgenden „Software“) durch registrierte Nutzerinnen und Nutzer (im
                            Folgenden „User“). Mit der Nutzung der Software erklärt sich der User mit diesen AGB
                            einverstanden.

                        </p>
                        <p className={'font-bold'}>2. Leistungsbeschreibung / Wichtiger Hinweis</p>
                        <p className="mb-3">
                            (1) Die Software dient ausschließlich als Transkriptions-Tool zur automatisierten Umwandlung
                            von Audioaufnahmen in Text.
                            <br/>
                            (2) Die Software ist kein Medizinprodukt im Sinne der EU-Medizinprodukteverordnung (MDR
                            2017/745). Sie ist nicht dafür bestimmt und nicht geeignet, Krankheiten oder
                            Gesundheitszustände zu erkennen, zu verhüten, zu überwachen, zu behandeln oder zu lindern.
                            <br/>
                            (3) Die Software erhebt keinen Anspruch auf Richtigkeit, Vollständigkeit oder medizinische
                            Verwendbarkeit der erzeugten Texte.
                            <br/>
                            (4) Jegliche Verwendung im medizinischen oder diagnostischen Kontext ist ausdrücklich
                            ausgeschlossen.
                            <br/>
                        </p>
                        <p className={'font-bold'}>
                            3. Nutzungseinschränkungen
                        </p>
                        <p className="mb-3">
                            (1) Die Software darf ausschließlich für administrative, organisatorische oder
                            dokumentarische Zwecke genutzt werden.
                            <br/>
                            (2) Es ist dem User strengstens untersagt, die Software in einem medizinischen
                            Entscheidungsprozess oder für die Erstellung rechtsverbindlicher medizinischer Dokumente
                            einzusetzen.
                            <br/>
                            (3) Der User verpflichtet sich, keine patientenidentifizierenden Informationen (z. B. Name,
                            Geburtsdatum, Anschrift, Fallnummern, Versicherungsnummern, Bilddaten) in die Software
                            einzugeben oder per Audio bereitzustellen.
                        </p>
                        <p className={'font-bold'}>
                            4. Pflichten des Users
                        </p>
                        <p className={"mb-3"}>
                            (1) Der User ist verpflichtet, die Software ausschließlich im Rahmen der geltenden Gesetze
                            sowie dieser AGB zu nutzen.
                            <br/>
                            (2) Der User trägt die alleinige Verantwortung für die von ihm eingegebenen Inhalte und
                            deren Verwendung.
                            <br/>
                            (3) Verstößt der User gegen die in Ziffer 3 genannten Einschränkungen, stellt er den
                            Anbieter von jeglicher Haftung frei.
                            <br/>
                        </p>
                        <p className={'font-bold'}>
                            5. Haftungsausschluss
                        </p>
                        <p className={"mb-3"}>
                            (1) Der Anbieter übernimmt keine Gewähr für die inhaltliche Richtigkeit, Vollständigkeit
                            oder Brauchbarkeit der generierten Texte.
                            <br/>
                            (2) Jegliche Haftung des Anbieters für Schäden, die aus der Nutzung der Software
                            resultieren, ist ausgeschlossen, soweit nicht Vorsatz oder grobe Fahrlässigkeit vorliegt.
                            <br/>
                            (3) Eine Haftung für mittelbare Schäden, Folgeschäden oder entgangenen Gewinn wird
                            ausgeschlossen.
                            <br/>
                            (4) Die Haftung nach zwingenden gesetzlichen Vorschriften (z. B. Produkthaftungsgesetz)
                            bleibt unberührt, soweit anwendbar.
                            <br/>
                        </p>
                        <p className={'font-bold'}>
                            6. Verfügbarkeit und Änderungen
                        </p>
                        <p className={"mb-3"}>
                            (1) Der Anbieter bemüht sich um eine möglichst unterbrechungsfreie Verfügbarkeit, übernimmt
                            jedoch keine Garantie für ständige Erreichbarkeit oder fehlerfreie Funktion.
                            <br/>
                            (2) Der Anbieter behält sich vor, die Software jederzeit zu ändern, einzuschränken oder
                            einzustellen.
                            <br/>

                        </p>
                        <p className={'font-bold'}>
                            7. Datenschutz
                        </p>
                        <p className={"mb-3"}>
                            (1) Da die Software ausdrücklich nicht für die Verarbeitung von Gesundheitsdaten vorgesehen
                            ist, dürfen solche Daten nicht eingegeben werden.
                            <br/>
                            (2) Verarbeitet werden ausschließlich diejenigen personenbezogenen Daten, die für
                            Registrierung, Login und technische Funktion erforderlich sind. Näheres regelt die
                            Datenschutzerklärung.
                            <br/>
                        </p>
                        <p className={'font-bold'}>
                            8. Urheberrechte

                        </p>
                        <p className={"mb-3"}>
                            (1) Alle Rechte an der Software liegen beim Anbieter.
                            <br/>
                            (2) Der User erhält ein einfaches, nicht übertragbares Nutzungsrecht für die Dauer der
                            Nutzung.
                            <br/>
                        </p>
                        <p className={'font-bold'}>9. Laufzeit und Kündigung</p>
                        <p className={"mb-3"}>
                            (1) Das Nutzungsverhältnis wird auf unbestimmte Zeit geschlossen.
                            <br/>
                            (2) Der Anbieter kann den Zugang jederzeit sperren oder kündigen, wenn der User gegen diese
                            AGB verstößt.
                            <br/>
                        </p>
                        <p className={'font-bold'}>10 Schlussbestimmungen</p>
                        <p className={"mb-3"}>
                            (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
                            <br/>
                            (2) Gerichtsstand ist [Sitz des Anbieters], sofern der User Kaufmann ist.
                            <br/>
                            (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der
                            übrigen Bestimmungen unberührt.
                            <br/>
                        </p>
                        <p className={"mb-3"}></p>

                    </div>
                    <div className="mt-4 flex items-center justify-end gap-3">
                        <button
                            onClick={acceptConsent}
                            className="inline-flex items-center rounded-md bg-aureum-yellow px-4 py-2 text-sm font-semibold text-aureum-buttonText hover:brightness-110"
                        >Ich habe die Hinweise gelesen, verstanden und stimme den AGB zu.
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
