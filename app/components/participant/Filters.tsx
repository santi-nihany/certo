"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { FilterIcon } from "lucide-react"

interface FiltersProps {
  showWorldcoinOnly: boolean
  setShowWorldcoinOnly: (value: boolean) => void
  filters: string[]
  toggleFilter: (requisite: string) => void
  allRequisites: string[]
}


export default function Filters ({showWorldcoinOnly, setShowWorldcoinOnly, filters, toggleFilter, allRequisites}: FiltersProps) {
    return (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <FilterIcon className="mr-2" /> Filters
                    </h2>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="worldcoin-mode"
                            checked={showWorldcoinOnly}
                            onCheckedChange={setShowWorldcoinOnly}
                        />
                        <Label htmlFor="worldcoin-mode">Worldcoin ID required</Label>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {allRequisites.map((requisite) => (
                        <div key={requisite} className="flex items-center space-x-2">
                            <Checkbox
                                id={requisite}
                                checked={filters.includes(requisite)}
                                onCheckedChange={() => toggleFilter(requisite)}
                            />
                            <label
                                htmlFor={requisite}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {requisite}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
    );
}