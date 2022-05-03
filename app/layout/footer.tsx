interface FooterProps {
  year: number;
}

export default function Footer({ year }: FooterProps) {
  return (
    <div className="border-top bg-light mt-4">
      <footer className="container d-flex flex-wrap justify-content-between align-items-center py-3 px-3">
        <p className="col-md-4 mb-0 text-muted">© {year} Company, Inc</p>
      </footer>
    </div>
  );
}
