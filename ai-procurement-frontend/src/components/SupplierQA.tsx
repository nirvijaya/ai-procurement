const questions = [
    {
      q: "Can we extend submission deadline?",
      a: "Deadline extension not allowed as per policy.",
    },
    {
      q: "Is EU-based supplier mandatory?",
      a: "Yes, due to compliance requirements.",
    },
  ];
  
  export default function SupplierQA() {
    return (
      <div className="space-y-4">
        {questions.map((item, index) => (
          <div key={index} className="border-b pb-2">
            <p className="text-sm font-medium">{item.q}</p>
            <p className="text-xs text-gray-500">{item.a}</p>
          </div>
        ))}
      </div>
    );
  }