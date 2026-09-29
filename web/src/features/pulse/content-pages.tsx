"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useDemo } from "./provider";
import { validSource, type Article } from "./model";
import {
  EmptyState,
  FormNote,
  InputError,
  PageTitle,
  Panel,
  Status,
} from "@/components/pulse/primitives";
import { Gate } from "@/components/pulse/shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";

export function Library() {
  const { state } = useDemo();
  const [query, setQuery] = useState("");
  const articles = state.articles.filter(
    (a) =>
      a.published &&
      `${a.title} ${a.category} ${a.symptoms}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <>
      <PageTitle
        eyebrow="UNDERSTANDING STARTS HERE"
        title="A clearer perspective on health."
        description="Brief information summaries with source links. General education, not personalized medical advice."
      />
      <Panel>
        <div className="p-search-line">
          <Icon name="search" />
          <label className="sr-only" htmlFor="article-search">
            Search health information
          </label>
          <input
            id="article-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a topic, category, or symptom"
          />
        </div>
      </Panel>
      <div className="p-article-grid p-section">
        {articles.map((a, i) => (
          <article key={a.id} className="p-article-card">
            <Link
              href={`/library/${a.id}`}
              className={`p-article-art art-${i % 3}`}
              aria-label={`Read ${a.title}`}
            >
              <Icon
                name={
                  a.category === "Heart health"
                    ? "heart"
                    : a.category === "Skin health"
                      ? "sparkle"
                      : "book"
                }
                size={48}
              />
              <span>HEALTH, EXPLAINED</span>
            </Link>
            <div>
              <span className="p-eyebrow">{a.category}</span>
              {a.edited && (
                <span className="p-demo-chip">Unreviewed demo edit</span>
              )}
              <h2>
                <Link href={`/library/${a.id}`}>{a.title}</Link>
              </h2>
              <p>{a.summary}</p>
              <Link href={`/library/${a.id}`} className="p-text-link">
                Read introduction <Icon name="arrow" size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!articles.length && (
        <Panel>
          <EmptyState
            icon="book"
            title="No matching information"
            action={
              <Button variant="secondary" onClick={() => setQuery("")}>
                Clear search
              </Button>
            }
          >
            Try a different topic, or publish a fictional entry from the content
            demo.
          </EmptyState>
        </Panel>
      )}
      <FormNote>
        Original seed summaries reference NHS pages checked on 28 September
        2026. Demo edits are marked unreviewed and must not be used for health
        decisions.
      </FormNote>
    </>
  );
}
export function ArticleReader({ id }: { id: string }) {
  const { state } = useDemo();
  const article = state.articles.find((a) => a.id === id && a.published);
  if (!article)
    return (
      <EmptyState
        icon="book"
        title="This entry isn’t available"
        action={
          <Link className="p-link-button" href="/library">
            Back to the library
          </Link>
        }
      >
        The entry is unpublished or no longer exists in this demo session.
      </EmptyState>
    );
  return (
    <>
      <Link className="p-back-link" href="/library">
        ← Back to health library
      </Link>
      <PageTitle
        eyebrow={article.category.toUpperCase()}
        title={article.title}
        description={
          article.edited
            ? "Unreviewed demo content — for interface testing only."
            : "An introductory summary based on the linked NHS information."
        }
      />
      <Panel className="p-reader">
        <span className="p-feature-icon">
          <Icon name="book" size={27} />
        </span>
        {article.edited && (
          <div className="p-notice error" role="note">
            <Icon name="info" />
            <span>
              This entry was edited inside the demo. Its clinical accuracy has
              not been reviewed.
            </span>
          </div>
        )}
        <h2>Overview</h2>
        <p>{article.summary}</p>
        <h2>Symptoms & context</h2>
        <p>{article.symptoms}</p>
        <div className="p-source-box">
          <span className="p-eyebrow">
            {article.edited
              ? "REFERENCE LINK · DOES NOT VERIFY DEMO EDITS"
              : "SOURCE · REVIEWED FOR THIS SEED SUMMARY"}
          </span>
          <a href={article.source} target="_blank" rel="noopener noreferrer">
            {new URL(article.source).hostname}
            <Icon name="arrow" size={16} />
          </a>
          <p>
            {article.edited
              ? "The demo author supplied this link. Edited text is not validated against it."
              : "NHS information. Read the original source for fuller context; this introduction does not replace professional advice."}
          </p>
        </div>
        <FormNote>
          Pulse does not diagnose conditions or recommend treatment. Contact
          a qualified clinician for personal medical concerns.
        </FormNote>
      </Panel>
    </>
  );
}
export function ContentLibrary() {
  const { state } = useDemo();
  const [filter, setFilter] = useState("All");
  const articles = state.articles.filter(
    (a) =>
      filter === "All" || (filter === "Published" ? a.published : !a.published),
  );
  return (
    <Gate role="editor">
      <PageTitle
        eyebrow="CONTENT MAINTAINER · DEMO CAPABILITY"
        title="Information, thoughtfully maintained."
        description="Create and edit demonstration entries. This persona does not establish a production administrator role."
        action={
          <Link href="/content/new" className="p-link-button">
            <Icon name="plus" size={17} />
            Create demo entry
          </Link>
        }
      />
      <div className="p-filter-tabs" role="group" aria-label="Filter content">
        {["All", "Published", "Draft"].map((f) => (
          <button
            aria-pressed={filter === f}
            key={f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <Panel className="p-list-panel">
        {articles.length ? (
          <div className="p-table-wrap">
            <table className="p-table">
              <caption className="sr-only">Health information entries</caption>
              <thead>
                <tr>
                  <th>Entry</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Edit entry</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.title}</strong>
                      <small>
                        {a.edited
                          ? "Unreviewed demo edit"
                          : "Seed summary with source"}
                      </small>
                    </td>
                    <td>{a.category}</td>
                    <td>
                      <Status>{a.published ? "Published" : "Draft"}</Status>
                    </td>
                    <td>
                      <Link href={`/content/${a.id}`} className="p-text-link">
                        Edit <Icon name="edit" size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="book"
            title="No entries in this view"
            action={
              <Link href="/content/new" className="p-link-button">
                Create an entry
              </Link>
            }
          >
            Use a different filter or prepare fictional test content.
          </EmptyState>
        )}
      </Panel>
      <FormNote>
        Published entries appear in the health library. Edited material remains
        marked as unreviewed and is for testing only.
      </FormNote>
    </Gate>
  );
}
export function ArticleEditor({ id }: { id: string }) {
  const { state, run } = useDemo();
  const router = useRouter();
  const [error, setError] = useState("");
  const original = state.articles.find((a) => a.id === id);
  const creating = id === "new";
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const source = String(f.get("source"));
    if (!validSource(source)) {
      setError("Use a valid HTTPS reference link.");
      return;
    }
    setError("");
    const article: Article = {
      id: original?.id ?? "new",
      title: String(f.get("title")),
      category: String(f.get("category")),
      summary: String(f.get("summary")),
      symptoms: String(f.get("symptoms")),
      source,
      published: f.get("published") === "on",
      edited: true,
    };
    if (await run({ type: "article", article })) router.push("/content");
  }
  return (
    <Gate role="editor">
      {!original && !creating ? (
        <EmptyState
          title="Entry not found"
          action={
            <Link href="/content" className="p-link-button">
              Back to content
            </Link>
          }
        >
          The entry may have reset with the demo session.
        </EmptyState>
      ) : (
        <>
          <Link className="p-back-link" href="/content">
            ← Back to content
          </Link>
          <PageTitle
            eyebrow="CLEAR INFORMATION STARTS HERE"
            title={
              creating
                ? "Create a demonstration entry."
                : "Refine this information entry."
            }
            description="Use fictional test copy for edits. Edited entries are always marked unreviewed."
          />
          <Panel className="p-editor-panel">
            <form className="p-form" onSubmit={submit} key={id}>
              <Field id="entry-title" label="Title">
                <input
                  id="entry-title"
                  name="title"
                  className="ui-input"
                  required
                  maxLength={120}
                  defaultValue={original?.title}
                />
              </Field>
              <Field id="entry-category" label="Category">
                <select
                  id="entry-category"
                  name="category"
                  className="ui-input"
                  defaultValue={original?.category ?? "Everyday health"}
                >
                  <option>Everyday health</option>
                  <option>Heart health</option>
                  <option>Skin health</option>
                </select>
              </Field>
              <Field id="entry-summary" label="Overview · demonstration text">
                <textarea
                  id="entry-summary"
                  name="summary"
                  className="ui-input"
                  required
                  rows={5}
                  maxLength={3000}
                  defaultValue={original?.summary}
                />
              </Field>
              <Field
                id="entry-symptoms"
                label="Symptoms & context · demonstration text"
              >
                <textarea
                  id="entry-symptoms"
                  name="symptoms"
                  className="ui-input"
                  required
                  rows={3}
                  maxLength={1500}
                  defaultValue={original?.symptoms}
                />
              </Field>
              <Field id="entry-source" label="HTTPS source reference">
                <input
                  type="url"
                  id="entry-source"
                  name="source"
                  className="ui-input"
                  required
                  defaultValue={original?.source}
                  placeholder="https://www.nhs.uk/conditions/"
                />
              </Field>
              <label className="p-check">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={original?.published ?? false}
                />
                Visible in the demo health library
              </label>
              <InputError>{error}</InputError>
              <FormNote>
                This checkbox demonstrates publication state, not clinical
                review or permission approval.
              </FormNote>
              <div className="p-form-actions">
                <Link href="/content" className="p-link-button secondary">
                  Go back
                </Link>
                <Button type="submit">Save demo entry</Button>
              </div>
            </form>
          </Panel>
        </>
      )}
    </Gate>
  );
}
